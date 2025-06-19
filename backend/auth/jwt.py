import os
from datetime import datetime, timedelta

from dotenv import load_dotenv
from jose import jwt, JWTError, ExpiredSignatureError

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

ACCESS_TOKEN_EXPIRE_MINUTES = 45
REFRESH_TOKEN_EXPIRE_DAYS = 7


def create_access_token(data: dict):
    to_decode = data.copy()
    expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_decode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_decode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict):
    to_decode = data.copy()
    expire = datetime.now() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_decode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_decode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str, token_type: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") == token_type:
            raise JWTError()
        return payload
    except ExpiredSignatureError or JWTError:
        return None
