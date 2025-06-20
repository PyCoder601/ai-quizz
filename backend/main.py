from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from backend.routes import auth, quiz
from backend.database.models import User, Quiz


from backend.database.db import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting database...")
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    print("Database started.")
    yield
    print("Closing app...")


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://react-frontend-4ipn.onrender.com",
        "http://localhost:5173/",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(quiz.router, prefix="/api")
