import os
import json
import hashlib
from pathlib import Path

from flask import Flask, request, jsonify
from flask_cors import CORS
from web3 import Web3
from dotenv import load_dotenv

from backend.merkle_utils import build_tree, get_proof
from model import authenticate_sneaker as ml_authenticate

# ── Load config relative to this file, not the cwd ──────────────────────────
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

app = Flask(__name__)
CORS(app)

# ── Blockchain setup ────────────────────────────────────────────────────────
rpc_url = os.getenv("RPC_URL")
private_key = os.getenv("PRIVATE_KEY")
contract_addr = os.getenv("CONTRACT_ADDRESS")

if not all([rpc_url, private_key, contract_addr]):
    raise RuntimeError(
        "Missing required env vars. "
        "Ensure PRIVATE_KEY, CONTRACT_ADDRESS, and RPC_URL are set in backend/.env"
    )

w3 = Web3(Web3.HTTPProvider(rpc_url))
account = w3.eth.account.from_key(private_key)
contract_address = Web3.to_checksum_address(contract_addr)

with open(BASE_DIR / "abi.json") as f:
    abi = json.load(f)

contract = w3.eth.contract(address=contract_address, abi=abi)


# ── Helper ──────────────────────────────────────────────────────────────────
def _build_txn(fn_call, gas=1_200_000, nonce=None):
    """Build, sign, and send a transaction; return the tx hash hex string."""
    if nonce is None:
        nonce = w3.eth.get_transaction_count(account.address)
    txn = fn_call.build_transaction({
        "chainId": 11155111,
        "from": account.address,
        "nonce": nonce,
        "gas": gas,
        "maxFeePerGas": w3.to_wei(25, "gwei"),
        "maxPriorityFeePerGas": w3.to_wei(2, "gwei"),
    })
    signed = w3.eth.account.sign_transaction(txn, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
    return tx_hash.hex()


# ── Routes ──────────────────────────────────────────────────────────────────

@app.route("/health", methods=["GET"])
def health():
    """Quick liveness check."""
    return jsonify({"status": "ok", "connected": "unknown"})


@app.route("/authenticate", methods=["POST"])
def authenticate():
    """
    Full pipeline: upload images → ORB model → SHA256 serial → blockchain.
    Expects multipart/form-data with:
      - reference_image : file (the canonical authentic sneaker image)
      - test_image      : file (the sneaker being verified)
      - batch_id        : int  (the batch ID to register under)
    """
    try:
        if "reference_image" not in request.files or "test_image" not in request.files:
            return jsonify({"error": "Both 'reference_image' and 'test_image' files are required."}), 400

        batch_id = request.form.get("batch_id", 1)
        try:
            batch_id = int(batch_id)
        except ValueError:
            return jsonify({"error": "batch_id must be an integer"}), 400

        ref_bytes = request.files["reference_image"].read()
        test_bytes = request.files["test_image"].read()

        # ── Step 1: Run the ORB ML model ─────────────────────────────────────
        is_authentic, confidence = ml_authenticate(ref_bytes, test_bytes)

        if not is_authentic:
            return jsonify({
                "authentic": False,
                "confidence": confidence,
                "verdict": "COUNTERFEIT",
                "message": "ORB feature matching failed the authenticity threshold."
            })

        # ── Step 2: Derive serial from image SHA256 hash ──────────────────────
        serial = hashlib.sha256(test_bytes).hexdigest()

        # ── Step 3: Register batch on-chain ───────────────────────────────────
        leaves = [hashlib.sha256(serial.encode()).digest()]
        tree   = build_tree(leaves)
        root   = tree[-1][0]

        # Fetch nonce once and increment manually to avoid nonce collision
        base_nonce = w3.eth.get_transaction_count(account.address)

        register_tx = _build_txn(
            contract.functions.registerBatch(batch_id, root),
            nonce=base_nonce
        )

        # ── Step 4: Verify product on-chain ───────────────────────────────────
        product_hash = hashlib.sha256(serial.encode()).digest()
        proof        = get_proof(tree, 0)   # single-leaf tree, empty proof
        score_int    = min(int(confidence * 10000), 10000)

        verify_tx = _build_txn(
            contract.functions.verifyProduct(batch_id, product_hash, proof, score_int),
            nonce=base_nonce + 1
        )

        return jsonify({
            "authentic":    True,
            "verdict":      "GENUINE",
            "confidence":   confidence,
            "serial":       serial,
            "register_tx":  register_tx,
            "verify_tx":    verify_tx,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/register_batch", methods=["POST"])
def register_batch():
    try:
        data = request.get_json(force=True)
        serials = data.get("serials")
        batch_id = data.get("batch_id")

        if not serials or batch_id is None:
            return jsonify({"error": "Missing 'serials' or 'batch_id'"}), 400

        leaves = [hashlib.sha256(s.encode()).digest() for s in serials]
        tree = build_tree(leaves)
        root = tree[-1][0]

        tx_hash = _build_txn(
            contract.functions.registerBatch(batch_id, root)
        )

        return jsonify({"batch_root": root.hex(), "tx_hash": tx_hash})

    except KeyError as e:
        return jsonify({"error": f"Missing field: {e}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/verify", methods=["POST"])
def verify():
    try:
        data = request.get_json(force=True)
        serial = data.get("serial")
        batch_id = data.get("batch_id")
        batch_serials = data.get("batch_serials")
        score = data.get("score", 10000)  # accept from request; default 10000

        if not serial or batch_id is None or not batch_serials:
            return jsonify({
                "error": "Missing 'serial', 'batch_id', or 'batch_serials'"
            }), 400

        if not (0 <= score <= 10000):
            return jsonify({"error": "score must be 0–10000"}), 400

        product_hash = hashlib.sha256(serial.encode()).digest()
        leaves = [hashlib.sha256(s.encode()).digest() for s in batch_serials]

        tree = build_tree(leaves)

        if serial not in batch_serials:
            return jsonify({"error": "serial not found in batch_serials"}), 400

        index = batch_serials.index(serial)
        proof = get_proof(tree, index)

        tx_hash = _build_txn(
            contract.functions.verifyProduct(batch_id, product_hash, proof, score)
        )

        return jsonify({"tx_hash": tx_hash, "authentic": True})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/transfer", methods=["POST"])
def transfer():
    try:
        data = request.get_json(force=True)
        serial = data.get("serial")
        new_owner = data.get("new_owner")

        if not serial or not new_owner:
            return jsonify({"error": "Missing 'serial' or 'new_owner'"}), 400

        product_hash = hashlib.sha256(serial.encode()).digest()

        tx_hash = _build_txn(
            contract.functions.transferOwnership(
                product_hash,
                Web3.to_checksum_address(new_owner),
            ),
            gas=500_000,
        )

        return jsonify({"tx_hash": tx_hash, "ownership_transferred": True})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)