import uuid

from fastapi_users import schemas


class UserRead(schemas.BaseUser[uuid.UUID]):
	api_key: str
	first_name: str
	last_name: str


class UserCreate(schemas.BaseUserCreate):
	first_name: str
	last_name: str


class UserUpdate(schemas.BaseUserUpdate):
	api_key: str
