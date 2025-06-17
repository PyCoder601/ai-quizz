from datetime import datetime

from pydantic import BaseModel


class User(BaseModel):
    username: str
    email: str
    quizzes: list


class QuizType(BaseModel):
    id: int
    question: str
    options: str
    correct_option: int
    explanation: str


class QuizRequest(BaseModel):
    topic: str
    difficulty: str
    number_of_questions: int


class QuizResponse(BaseModel):
    id: int | None
    title: str
    result: str | None = None
    created_at: datetime
    quizzes: list[QuizType]
    user_id: int | None = None


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    refresh_token: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserRegister(UserLogin):
    email: str
    username: str
    password: str


class TokenUser(BaseModel):
    user: User
    access_token: str
