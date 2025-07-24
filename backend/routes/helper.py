from datetime import datetime, timedelta

from sqlalchemy.ext.asyncio import AsyncSession

from backend.database.models import Quota


async def reset_quota_if_needed(db: AsyncSession, quota: Quota):
    now = datetime.now()
    if now - quota.last_reset > timedelta(hours=5):
        quota.quota_remaining = 5
        quota.last_reset = now
        await db.commit()
        await db.refresh(quota)
    return quota
