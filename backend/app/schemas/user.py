from typing import Optional

from pydantic import BaseModel, EmailStr


# Base classes
class UserBase(BaseModel):
    is_active: Optional[bool] = True
    username: Optional[str]
    #type: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]


class AdminBase(UserBase):
    type: str = 'admin'


class ConfigBase(UserBase):
    type: str


class EmployeeBase(UserBase):
    #type: str = 'employee' #TODO: evaluar si el tipo de usuario deberia ser modificable, y aplicarlo en todos los esquemas
    pass

class InformantBase(UserBase):
    type: str = 'informant_doctor'
    license: Optional[int]


class PatientBase(UserBase):
    type: str = 'patient'
    email: Optional[EmailStr]
    dni: Optional[str]
    birth_date: Optional[str]
    health_insurance_number: Optional[int]
    clinical_history: Optional[str]


# Properties to receive via API on creation

class AdminCreate(AdminBase):
    password: str


class ConfigCreate(ConfigBase):
    password: str


class EmployeeCreate(EmployeeBase):
    password: str


class InformantCreate(InformantBase):
    password: str


class PatientCreate(PatientBase):
    first_name: str
    last_name: str
    password: str
    email: EmailStr
    dni: str
    birth_date: str
    health_insurance_number: int
    clinical_history: str


# Properties to receive via API on update
class AdminUpdate(AdminBase):
    password: Optional[str] = None


class ConfigUpdate(ConfigBase):
    password: Optional[str] = None


class EmployeeUpdate(EmployeeBase):
    password: Optional[str] = None


class InformantUpdate(InformantBase):
    password: Optional[str] = None


class PatientUpdate(PatientBase):
    password: Optional[str] = None


class UserInDBBase(UserBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True

# Additional properties to return via API


class User(UserInDBBase):
    pass

class Administrator(UserInDBBase, AdminBase):
    pass


class Configurator(UserInDBBase, ConfigBase):
    pass


class Employee(UserInDBBase, EmployeeBase):
    pass


class InformantDoctor(UserInDBBase, InformantBase):
    pass


class Patient(UserInDBBase, PatientBase):
    pass


# Additional properties stored in DB
class AdminInDB(UserInDBBase, AdminBase):
    hashed_password: str


class ConfigInDB(UserInDBBase, ConfigBase):
    hashed_password: str


class EmployeeInDB(UserInDBBase, EmployeeBase):
    hashed_password: str


class InformantInDB(UserInDBBase, InformantBase):
    hashed_password: str


class PatientInDB(UserInDBBase, PatientBase):
    hashed_password: str
