from typing import List, Optional, Any
from pydantic import BaseModel
from datetime import datetime
from .user import Patient, Employee
from .referring_physician import ReferringPhysician
from .sample import Sample
from .appointment import Appointment
from .report import Report


class StudyStatesBase(BaseModel):
    study_id: int
    employee_id: int
    state: str
    state_entered_date: datetime


class StudyStatesCreate(StudyStatesBase):
    pass


class StudyStatesUpdate(StudyStatesBase):
    pass


class StudyStatesInDBBase(StudyStatesBase):
    id: int

    class Config:
        orm_mode = True


class StudyStates(StudyStatesInDBBase):
    pass


# Shared properties
class StudyBase(BaseModel):
    budget: Optional[float] = None

# Properties to receive on item creation


class StudyCreate(StudyBase):
    type_study_id: int
    patient_id: int
    referring_physician_id: int
    presumptive_diagnosis_id: int


# Properties to receive on item update
class StudyUpdate(StudyBase):
    type_study_id: Optional[int]
    presumptive_diagnosis_id: Optional[int]
    referring_physician_id: Optional[int]
    delayed: Optional[bool]


# Properties shared by models stored in DB
class StudyInDBBase(StudyBase):
    id: int
    created_date: Optional[datetime] = None  # TODO: arreglar el None
    updated_date: Optional[datetime] = None
    current_state: Optional[Any] = None
    current_state_entered_date: Optional[datetime] = None
    employee: Optional[Employee] = None  # TODO: arreglar el None
    patient: Optional[Patient] = None
    type_study: Any  # TODO: implementar esquema
    referring_physician: ReferringPhysician
    presumptive_diagnosis: Any  # TODO: implementar esquema
    payment_receipt: Optional[str] = None
    signed_consent: Optional[str] = None
    appointment: Optional[Appointment] = None
    report: Optional[Report] = None
    # past_states
    sample: Optional[Sample] = None
    delayed: bool

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
    id: Optional[int] = None

    class Config:
        orm_mode = True


class TypeStudyCreate(TypeStudyBase):
    name: str
    study_consent_template: str


class TypeStudyUpdate(TypeStudyBase):
    name: Optional[str] = None
    study_consent_template: Optional[str] = None


class TypeStudy(TypeStudyInDBBase):
    pass
