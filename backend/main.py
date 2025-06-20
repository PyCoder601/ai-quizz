import os
import asyncio
import httpx
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from backend.routes import auth, quiz
from backend.database.models import User, Quiz
from dotenv import load_dotenv

from backend.database.db import engine

load_dotenv()


async def keep_alive():
    while True:
        try:
            print("⏳ Sending keep-alive ping...")
            async with httpx.AsyncClient() as client:
                await client.get(os.getenv(os.getenv("BACKEND_API") + "/ping"))
            print("✅ Ping sent.")
        except Exception as e:
            print(f"❌ Ping failed: {e}")
        await asyncio.sleep(14 * 60)


@asynccontextmanager
async def lifespan(app: FastAPI):

    print("Starting database...")
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    print("Database started.")

    asyncio.create_task(keep_alive())
    yield
    print("Closing app...")


app = FastAPI(lifespan=lifespan)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes principales
app.include_router(auth.router, prefix="/api")
app.include_router(quiz.router, prefix="/api")


# Route de ping
@app.get("/api/ping")
async def ping():
    return {"message": "pong"}
