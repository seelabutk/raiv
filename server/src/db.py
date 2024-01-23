import os
from typing import AsyncGenerator

from fastapi import Depends
from fastapi_users.db import (
	SQLAlchemyBaseUserTableUUID,
	SQLAlchemyUserDatabase
)
from sqlalchemy import String
from sqlalchemy.ext.asyncio import (
	AsyncSession,
	async_sessionmaker,
	create_async_engine
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
	pass


class User(SQLAlchemyBaseUserTableUUID, Base):
	api_key: Mapped[str] = mapped_column(String, nullable=True)
	first_name: Mapped[str]
	last_name: Mapped[str]


DB_USER = os.environ['POSTGRES_USER']
DB_PASSWORD = os.environ['POSTGRES_PASSWORD']
DB_PORT = os.environ['POSTGRES_PORT']
DATABASE_URL = (
	f'postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@localhost:'
	f'{DB_PORT}/{DB_USER}'
)

engine = create_async_engine(DATABASE_URL)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)


async def create_db_and_tables():
	async with engine.begin() as conn:
		await conn.run_sync(Base.metadata.create_all)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
	async with async_session_maker() as session:
		yield session


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
	yield SQLAlchemyUserDatabase(session, User)
