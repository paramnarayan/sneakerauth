import hashlib

def sha(data: bytes) -> bytes:
    return hashlib.sha256(data).digest()

def hash_pair(a: bytes, b: bytes) -> bytes:
    return sha(a + b) if a < b else sha(b + a)

def build_tree(leaves):
    tree = [leaves]

    while len(tree[-1]) > 1:
        level = []
        current = tree[-1]

        for i in range(0, len(current), 2):
            left = current[i]
            right = current[i + 1] if i + 1 < len(current) else left
            level.append(hash_pair(left, right))

        tree.append(level)

    return tree

def get_proof(tree, index):
    proof = []
    for level in tree[:-1]:
        pair_index = index ^ 1
        if pair_index < len(level):
            proof.append(level[pair_index])
        index //= 2
    return proof