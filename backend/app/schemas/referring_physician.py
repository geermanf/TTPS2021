from typing import Optional

from pydantic import BaseModel, EmailStr


# Shared properties

class ReferringPhysicianBase(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    licence: Optional[int] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True


class ReferringPhysicianInDBBase(ReferringPhysicianBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True


class ReferringPhysicianCreate(ReferringPhysicianBase):
    first_name: str
    last_name: str
    licence: int
    email: EmailStr


class ReferringPhysicianUpdate(ReferringPhysicianBase):
    first_name: str
    last_name: str
    licence: int
    email: EmailStr
    is_active: Optional[bool] = True


class ReferringPhysician(ReferringPhysicianInDBBase):
    pass
