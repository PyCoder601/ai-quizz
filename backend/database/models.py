from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str

    quizzes: list["Quiz"] = Relationship(back_populates="user")
    quota: Optional["Quota"] = Relationship(back_populates="user")


class Quota(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int | None = Field(default=None, foreign_key="user.id")
    user: Optional[User] = Relationship(back_populates="quota")
    quota_remaining: int = Field(default=5)
    last_reset: datetime = Field(default_factory=datetime.now)

    def to_dict(self) -> dict:
        return {
            "quota_remaining": self.quota_remaining,
            "last_reset": self.last_reset.isoformat(),
        }


class Quiz(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    result: str | None = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.now)
    user_id: int | None = Field(default=None, foreign_key="user.id")
    user: Optional[User] = Relationship(back_populates="quizzes")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "result": self.result,
            "created_at": self.created_at.isoformat(),
        }
