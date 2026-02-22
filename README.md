# SneakerAuth 
is a decentralized authentication platform designed to combat the global counterfeit sneaker market. By combining advanced computer vision techniques with cryptographic verification on the Ethereum Sepolia Testnet, the system establishes a tamper-proof link between physical sneakers and their immutable digital authenticity records.
The platform ensures scalability, transparency, and trust without reliance on centralized databases.
# System Architecture Overview
SneakerAuth operates through three primary phases:
Authentication
Registration
Verification and Ownership Transfer
# Physical-to-Digital Bridging Using SHA-256
To eliminate dependency on centralized databases, SneakerAuth creates a deterministic cryptographic fingerprint of each authenticated sneaker.
# Mechanism:
Once authentication succeeds, the exact raw byte array of the test image is hashed using SHA-256.
This produces a 64-character hexadecimal string serving as the sneaker’s unique serial identifier.
# Security Properties:
Deterministic output
High collision resistance
Any pixel-level modification results in a completely different hash
Guarantees immutability of the sneaker’s digital identity
This hash becomes the sneaker’s permanent on-chain identity.
# Scalable Blockchain Anchoring via Merkle Trees
Directly storing individual hashes on-chain is not economically viable at scale. SneakerAuth implements a Merkle Tree-based batching architecture.
Batch Registration Model
Authenticated sneaker serials are grouped into production batches.
A Merkle Tree is constructed from all SHA-256 serials.
The resulting Merkle Root (32 bytes) is stored on-chain via the smart contract.
This ensures:
Constant gas cost per batch (O(1))
Infinite horizontal scalability
Cryptographic integrity of all batch members
Minimal on-chain storage footprint
Only the Merkle Root is stored on-chain, while proofs are generated off-chain.
# Computer Vision Authentication
During assessment, the backend executes an ORB (Oriented FAST and Rotated BRIEF) feature-matching algorithm using OpenCV.
Process:
A canonical reference image of an authentic sneaker is stored securely.
The uploaded test image is converted into raw byte arrays.
ORB extracts structural keypoints and descriptors from both images.
A feature-matching confidence score is computed.
If structural similarity exceeds 51%, the sneaker is classified as authentic.
This approach ensures structural verification rather than relying on superficial visual cues.
# ECDSA-Based Ownership Control
Ownership transfers use Ethereum’s native cryptographic mechanism:
The smart contract validates transactions using ECDSA signatures.
Only the current cryptographic owner can authorize a transfer.
Transfers are recorded immutably on the blockchain.
All verification logic executes on the Ethereum network using Solidity smart contracts.
