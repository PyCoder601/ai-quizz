from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlmodel import select
from starlette.responses import JSONResponse

from backend.auth.jwt import create_access_token, create_refresh_token, verify_token
from backend.database.schemas import UserLogin, Token, UserRegister, UserResponse
from backend.auth.utils import verify_password, get_password_hash
from backend.database.db import get_async_session
from backend.database.models import User, Quota
from backend.routes.helper import reset_quota_if_needed

router = APIRouter()


from fastapi import HTTPException, status
from sqlalchemy import select


@router.post("/sign-up", response_model=UserResponse)
async def sign_up(
    data: UserRegister, session: AsyncSession = Depends(get_async_session)
):
    result = await session.execute(select(User).where(User.username == data.username))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already registered",
        )

    hashed_password = get_password_hash(data.password)
    user = User(
        username=data.username,
        email=data.email,
        hashed_password=hashed_password,
    )

    session.add(user)
    await session.commit()
    await session.refresh(user)

    quota = Quota(user_id=user.id)
    session.add(quota)
    await session.commit()
    await session.refresh(quota)

    user_data = {"sub": user.username, "user_id": user.id}
    access_token = create_access_token(user_data)
    refresh_token = create_refresh_token(user_data)

    res = JSONResponse(
        {
            "user": {
                "username": user.username,
                "email": user.email,
            },
            "quota": quota.to_dict(),
            "quizzes": [],
            "access_token": access_token,
        }
    )

    res.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        max_age=7 * 24 * 60 * 60,
        samesite=None,
    )
    return res


@router.post("/token", response_model=UserResponse)
async def login(
    data: UserLogin,
    session: AsyncSession = Depends(get_async_session),
):

    result = await session.execute(
        select(User)
        .options(selectinload(User.quizzes))
        .where(User.username == data.username)
    )
    user = result.first()[0]
    if not user or verify_password(data.password, user.hashed_password) is False:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    user_data = {"sub": user.username, "user_id": user.id}
    access_token = create_access_token(user_data)
    refresh_token = create_refresh_token(user_data)

    user_quota = await session.execute(select(Quota).where(Quota.user_id == user.id))

    user_quota = user_quota.scalar_one_or_none()

    user_quota = await reset_quota_if_needed(session, user_quota)

    res = JSONResponse(
        {
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
            "quota": user_quota.to_dict(),
            "quizzes": [quiz.to_dict() for quiz in user.quizzes],
            "access_token": access_token,
        }
    )

    res.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        max_age=7 * 24 * 60 * 60,
        samesite=None,
    )

    return res


@router.post("/refresh", response_model=Token)
async def refresh_token_func(request: Request):
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=400, detail="No refresh token")

    payload = verify_token(refresh_token, token_type="refresh")

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    access_token = create_access_token(payload)
    refresh_token = create_refresh_token(payload)

    res = JSONResponse(
        {
            "access_token": access_token,
        }
    )
    res.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        max_age=7 * 24 * 60 * 60,
        samesite=None,
    )
    return res


@router.post("/logout")
async def logout(request: Request):
    res = JSONResponse(
        {
            "message": "Logged out",
        }
    )
    res.delete_cookie(key="refresh_token")


@router.get("/stay-online")
async def stay_online(request: Request):
    return {"message": "Stay online"}
