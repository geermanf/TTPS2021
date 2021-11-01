from typing import Optional

from pydantic import BaseModel


# Shared properties
class StudyBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


# Properties to receive on item creation
class StudyCreate(StudyBase):
    title: str


# Properties to receive on item update
class StudyUpdate(StudyBase):
    pass


# Properties shared by models stored in DB
class StudyInDBBase(StudyBase):
    id: int
    title: str
    owner_id: int

    class Config:
        orm_mode = True


# Properties to return to client
class Study(StudyInDBBase):
    pass


# Properties properties stored in DB
class StudyInDB(StudyInDBBase):
    pass


class TypeStudyBase(BaseModel):
    name: Optional[str] = None
    study_consent_template: Optional[str] = None


class TypeStudyInDBBase(TypeStudyBase):
    class Config:
        orm_mode = True


class TypeStudyCreate(TypeStudyBase):
    name: str
    study_consent_template: str


class TypeStudyUpdate(TypeStudyBase):
    name: str
    study_consent_template: str


class TypeStudy(TypeStudyInDBBase):
    pass


