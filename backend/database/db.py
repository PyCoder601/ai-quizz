import os

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

load_dotenv()

DATABASE_URL = (
    f"postgresql+asyncpg://{os.getenv("DB_USER")}:"
    f"{os.getenv("DB_PASSWORD")}@{os.getenv("DB_HOST")}:"
    f"{os.getenv("DB_PORT")}/{os.getenv("DB_NAME")}"
)

engine = create_async_engine(DATABASE_URL)

async_session = async_sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)


async def get_async_session():
    async with async_session() as session:
        yield session
