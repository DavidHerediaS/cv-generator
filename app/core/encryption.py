import os 
from cryptography.fernet import Fernet
from app.core.config import settings

def get_fernet() -> Fernet:
    key = settings.ENCRYPTION_KEY.encode()
    return Fernet(key)


def encrypt(value: str) -> str:
    if not value:
        return value
    f = get_fernet()
    return f.encrypt(value.encode()).decode()


def decrypt(value: str) -> str:
    if not value:
        return value
    f = get_fernet()
    return f.decrypt(value.encode()).decode()