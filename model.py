

import cv2
import numpy as np


def authenticate_sneaker(img_bytes1: bytes, img_bytes2: bytes) -> tuple[bool, float]:
   
    arr1 = np.frombuffer(img_bytes1, np.uint8)
    arr2 = np.frombuffer(img_bytes2, np.uint8)

    img1 = cv2.imdecode(arr1, cv2.IMREAD_GRAYSCALE)
    img2 = cv2.imdecode(arr2, cv2.IMREAD_GRAYSCALE)

    if img1 is None or img2 is None:
        raise ValueError("Could not decode one or both images. Check file format.")

    
    orb = cv2.ORB_create(nfeatures=2000)
    kp1, des1 = orb.detectAndCompute(img1, None)
    kp2, des2 = orb.detectAndCompute(img2, None)

    if des1 is None or des2 is None or len(kp1) == 0 or len(kp2) == 0:
        return False, 0.0

    
    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    matches = bf.match(des1, des2)
    matches = sorted(matches, key=lambda x: x.distance)

   
    good_matches = [m for m in matches if m.distance < 50]

    score = min(len(good_matches) / 100.0, 1.0)

 
    is_authentic = score >= 0.51

    return is_authentic, round(score, 4)