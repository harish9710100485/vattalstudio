# backend/app/audit_service.py
from sqlalchemy.orm import Session
from .models import AuditLog
import json
import logging

logger = logging.getLogger(__name__)

def log_action(
    db: Session,
    user_id: int,
    action: str,
    table_name: str = None,
    record_id: int = None,
    changes: dict = None,
    ip_address: str = None
):
    """Log an action to audit log"""
    try:
        changes_str = json.dumps(changes) if changes else None
        audit_log = AuditLog(
            user_id=user_id,
            action=action,
            table_name=table_name,
            record_id=record_id,
            changes=changes_str,
            ip_address=ip_address
        )
        db.add(audit_log)
        db.commit()
        logger.debug(f"📝 Audit log: {action} by user {user_id}")
        return audit_log
    except Exception as e:
        logger.error(f"⚠️ Audit log error: {e}")
        db.rollback()
        return None