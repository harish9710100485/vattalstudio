from datetime import datetime, timedelta
from jose import JWTError, jwt
import bcrypt
from .config import Config
import logging

logger = logging.getLogger(__name__)

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    try:
        password_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt(rounds=12)
        hashed = bcrypt.hashpw(password_bytes, salt)
        return hashed.decode('utf-8')
    except Exception as e:
        logger.error(f"Hash error: {e}")
        return password  # Fallback to plain text

def verify_password(plain: str, hashed: str) -> bool:
    """Verify a password against its hash"""
    try:
        # Check if it's a bcrypt hash
        if hashed and hashed.startswith('$2b$'):
            result = bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))
            logger.debug(f"Bcrypt verification: {result}")
            return result
        else:
            # Plain text comparison (for development)
            result = plain == hashed
            logger.debug(f"Plain text verification: {result}")
            return result
    except Exception as e:
        logger.error(f"Verify error: {e}")
        return plain == hashed

def create_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=Config.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, Config.SECRET_KEY, algorithm=Config.ALGORITHM)

def decode_token(token: str):
    try:
        return jwt.decode(token, Config.SECRET_KEY, algorithms=[Config.ALGORITHM])
    except JWTError:
        return None
