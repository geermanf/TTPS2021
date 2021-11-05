from typing import List, Optional, Any

from pydantic import BaseModel
from datetime import datetime

from enum import Enum

from .user import User, Patient, ReportingPhysician, Employee
from .referring_physician import ReferringPhysician

class ResultEnum(str, Enum):
    # PENDING = 'pendiente'
    POSITIVE = 'positivo'
    NEGATIVE = 'negativo'



class HistoryBase(BaseModel):
    study_id: int
    employee_id: int
    state: Any
    state_entered_date: datetime

class HistoryInDBBase(HistoryBase):
    id: int

    class Config:
        orm_mode = True

class History(HistoryInDBBase):
    pass


class ReportBase(BaseModel):
    result: Optional[ResultEnum] = None
    report: Optional[str]

class ReportCreate(ReportBase):
    study_id: int
    reporting_physician_id: int
    result: ResultEnum
    report: str

class ReportInDBBase(ReportBase):
    id: int
    date_report: Optional[datetime] = None #TODO: que no sea opcional
    reporting_physician: Optional[ReportingPhysician] = None #TODO: que no sea opcional
    
    class Config:
        orm_mode = True

class Report(ReportInDBBase):
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


# Properties shared by models stored in DB
class StudyInDBBase(StudyBase):
    id: int
    created_date: Optional[datetime] = None #TODO: arreglar el None
    updated_date: Optional[datetime] = None
    current_state: Optional[Any] = None
    current_state_entered_date: Optional[datetime] = None
    employee: Optional[Employee] = None #TODO: arreglar el None
    patient: Patient
    type_study: Any #TODO: implementar esquema
    referring_physician: ReferringPhysician
    presumptive_diagnosis: Any #TODO: implementar esquema
    report: Optional[Report] = None
    #history
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


class DetailedReport(Report):
    study: Study