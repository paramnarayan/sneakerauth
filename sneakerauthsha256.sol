// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SneakerAuthSHA256 {

    address public admin;

    struct Product {
        address currentOwner;
        uint256 aiScore;      // 0–10000
        uint256 verifiedAt;
        bool verified;
    }

    // batchId => merkleRoot (SHA256 root)
    mapping(uint256 => bytes32) public batchRoots;

    // productHash => Product
    mapping(bytes32 => Product) public products;

    event BatchRegistered(uint256 batchId, bytes32 root);
    event ProductVerified(bytes32 productHash, uint256 score);
    event OwnershipTransferred(bytes32 productHash, address newOwner);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // =========================
    // 1️⃣ Register Batch Root
    // =========================
    function registerBatch(uint256 batchId, bytes32 merkleRoot)
        public
        onlyAdmin
    {
        batchRoots[batchId] = merkleRoot;
        emit BatchRegistered(batchId, merkleRoot);
    }

    // =========================
    // 2️⃣ SHA256 Merkle Verify
    // =========================
    function verifyProduct(
        uint256 batchId,
        bytes32 productHash,
        bytes32[] calldata proof,
        uint256 score
    ) public {

        require(score <= 10000, "Invalid score");

        bytes32 computedHash = productHash;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (computedHash < proofElement) {
                computedHash = sha256(
                    abi.encodePacked(computedHash, proofElement)
                );
            } else {
                computedHash = sha256(
                    abi.encodePacked(proofElement, computedHash)
                );
            }
        }

        require(
            computedHash == batchRoots[batchId],
            "Invalid Merkle proof"
        );

        products[productHash] = Product({
            currentOwner: msg.sender,
            aiScore: score,
            verifiedAt: block.timestamp,
            verified: true
        });

        emit ProductVerified(productHash, score);
    }

    // =========================
    // 3️⃣ Transfer Ownership
    // =========================
    function transferOwnership(
        bytes32 productHash,
        address newOwner
    ) public {

        require(products[productHash].verified, "Not verified");
        require(
            msg.sender == products[productHash].currentOwner,
            "Not owner"
        );

        products[productHash].currentOwner = newOwner;

        emit OwnershipTransferred(productHash, newOwner);
    }

    // =========================
    // 4️⃣ View Product
    // =========================
    function getProduct(bytes32 productHash)
        public
        view
        returns (
            bool verified,
            address owner,
            uint256 aiScore,
            uint256 verifiedAt
        )
    {
        Product memory p = products[productHash];

        return (
            p.verified,
            p.currentOwner,
            p.aiScore,
            p.verifiedAt
        );
    }
}