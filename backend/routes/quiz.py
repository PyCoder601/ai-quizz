import json

from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from backend.auth.jwt import SECRET_KEY, ALGORITHM
from backend.database.models import Quiz
from backend.database.schemas import QuizRequest, QuizResponse, QuizUpdate
from backend.database.db import get_async_session
from backend.routes.generate_quizzes import generate_challenge_with_ai

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@router.post("/generate-quiz", response_model=QuizResponse)
async def quiz(
    data: QuizRequest,
    token: str = Depends(oauth2_scheme),
    session: AsyncSession = Depends(get_async_session),
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=400, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    new_quizzes = generate_challenge_with_ai(
        data.topic, data.difficulty, data.number_of_questions
    )

    if "error" in new_quizzes:
        raise HTTPException(status_code=500, detail=new_quizzes["error"])

    new_quizz = Quiz(title=data.topic, user_id=user_id)
    session.add(new_quizz)
    await session.commit()
    await session.refresh(new_quizz)

    new_quizzes = new_quizzes.get("quizzes", [])

    return {
        "id": new_quizz.id,
        "title": new_quizz.title,
        "created_at": new_quizz.created_at,
        "elements": new_quizzes,
    }


@router.get("/quizzes-history", response_model=list[QuizResponse])
async def quizzes_history(
    token: str = Depends(oauth2_scheme),
    session: AsyncSession = Depends(get_async_session),
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    quizzes = await session.execute(select(Quiz).where(Quiz.user_id == user_id))
    return quizzes.scalars().all()


@router.patch("/quizzes-resul/{quiz_id}")
async def update_quiz_result(
    quiz_id: int, data: QuizUpdate, session: AsyncSession = Depends(get_async_session)
):
    result = await session.execute(select(Quiz).where(Quiz.id == quiz_id))
    cur_quiz = result.scalar_one_or_none()

    if not cur_quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    cur_quiz.result = data.result

    session.add(cur_quiz)
    await session.commit()
    await session.refresh(cur_quiz)

    return {"message": "Quiz updated", "quiz": cur_quiz}
