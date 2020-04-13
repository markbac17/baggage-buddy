from random import random
import bcrypt

def generate_token():
    seed = str(random())
    return hashlib.sha256(seed.encode()).hexdigest()[:32]

def encrypt_password(password):
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed_pw