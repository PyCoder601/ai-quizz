from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str

    quizzes: list["Quiz"] = Relationship(back_populates="user")


class Quiz(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    result: str | None = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.now)
    user_id: int | None = Field(default=None, foreign_key="user.id")
    user: Optional[User] = Relationship(back_populates="quizzes")

    elements: list["QuizElement"] = Relationship(back_populates="quiz")


class QuizElement(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    question: str
    options: str
    correct_option: int
    explanation: str

    quiz_id: int | None = Field(default=None, foreign_key="quiz.id")
    quiz: Optional["Quiz"] = Relationship(back_populates="elements")
