# backend/app/utils/id_encryption.py
import os
import base64
from cryptography.fernet import Fernet
from ..config import Config
import logging

logger = logging.getLogger(__name__)

# Get encryption key from environment
ENCRYPTION_KEY = Config.ENCRYPTION_KEY

# If no key is set, generate one (but warn)
if not ENCRYPTION_KEY:
    logger.warning("ENCRYPTION_KEY not set - Generating temporary key. This will break across restarts!")
    ENCRYPTION_KEY = Fernet.generate_key().decode()

# Ensure key is bytes
if isinstance(ENCRYPTION_KEY, str):
    ENCRYPTION_KEY = ENCRYPTION_KEY.encode()

try:
    cipher = Fernet(ENCRYPTION_KEY)
except Exception as e:
    logger.error(f"Failed to initialize encryption: {e}")
    # Fallback: create a new key
    ENCRYPTION_KEY = Fernet.generate_key()
    cipher = Fernet(ENCRYPTION_KEY)

def encrypt_id(id: int) -> str:
    """Encrypt an integer ID to a URL-safe string"""
    try:
        return base64.urlsafe_b64encode(cipher.encrypt(str(id).encode())).decode()
    except Exception as e:
        logger.error(f"Encryption error: {e}")
        # Fallback: simple base64 encoding
        return base64.urlsafe_b64encode(str(id).encode()).decode()

def decrypt_id(encrypted: str) -> int:
    """Decrypt a URL-safe string back to integer ID"""
    try:
        decrypted = cipher.decrypt(base64.urlsafe_b64decode(encrypted.encode()))
        return int(decrypted.decode())
    except Exception as e:
        logger.error(f"Decryption error: {e}")
        # Try fallback: base64 decode
        try:
            return int(base64.urlsafe_b64decode(encrypted.encode()).decode())
        except:
            raise ValueError("Invalid encrypted ID")
