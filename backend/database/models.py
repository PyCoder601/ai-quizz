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

    def to_dict(self, include_elements: bool = False) -> dict:
        data = {
            "id": self.id,
            "title": self.title,
            "result": self.result,
            "created_at": self.created_at.isoformat(),
        }
        if include_elements:
            data["elements"] = [el.to_dict() for el in self.elements]
        return data


class QuizElement(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    question: str
    options: str
    correct_option: int
    explanation: str
    point: int

    quiz_id: int | None = Field(default=None, foreign_key="quiz.id")
    quiz: Optional["Quiz"] = Relationship(back_populates="elements")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "question": self.question,
            "options": self.options,
            "correct_option": self.correct_option,
            "explanation": self.explanation,
            "point": self.point,
            "quiz_id": self.quiz_id,
        }
