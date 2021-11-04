from typing import Any, Dict, Optional, Union

from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase, ModelType, CreateSchemaType, UpdateSchemaType
from app.models import User, Admin, Employee, InformantPhysician, Patient
from app.schemas import (
    AdminCreate, AdminUpdate,
    InformantCreate, InformantUpdate,
    EmployeeCreate, EmployeeUpdate,
    PatientCreate, PatientUpdate
)

class FastAPIUsersException(Exception):
    pass

class UserAlreadyExists(FastAPIUsersException):
    pass

class UsernameAlreadyRegistered(FastAPIUsersException):
    pass

class EmailAlreadyRegistered(FastAPIUsersException):
    pass

class UserNotExists(FastAPIUsersException):
    pass


class UserInactive(FastAPIUsersException):
    pass



class CRUDUser(CRUDBase[ModelType, CreateSchemaType, UpdateSchemaType]):

    def _get_by_username(self, db: Session, *, username: str) -> Optional[User]:
        user = db.query(User).filter(User.username == username).first()
        if user is None:
            raise UserNotExists()
        return user

    def _get_by_email(self, db: Session, *, email: str) -> Optional[ModelType]:
        if hasattr(self.mode, 'email'):
            user = db.query(self.model).filter(self.model.email == email).first()
            if user is None:
                raise UserNotExists()
            return user
        else:
            raise UserNotExists()

    def get_by_username(self, db: Session, *, username: str) -> Optional[User]:
        return db.query(User).filter(User.username == username).first()

    def get_by_email(self, db: Session, *, email: str) -> Optional[ModelType]:
        if hasattr(self.model, 'email'):
            return db.query(self.model).filter(self.model.email == email).first()
    
    def _validate_creation(self, db: Session, db_obj: ModelType, data: Dict[str, Any]) -> None:
        # TODO: para un paciente validar unico dni, medico unica licencia
        existing_user = self.get_by_username(db, username=data["username"])
        if existing_user is not None:
            raise UsernameAlreadyRegistered()

        if 'email' in data:
            existing_user = self.get_by_email(db, email=data["email"])
            if existing_user is not None:
                raise EmailAlreadyRegistered()

    def create(
        self, db: Session, *, db_obj: ModelType, obj_in: Union[CreateSchemaType, Dict[str, Any]]
    ) -> ModelType:
        if isinstance(obj_in, dict):
            create_data = obj_in
        else:
            create_data = obj_in.dict(exclude_unset=True)
        self._validate_creation(db, db_obj, create_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def _validate_update(self, db: Session, db_obj: ModelType, data: Dict[str, Any]) -> None:
        username = data["username"]
        if username and username != db_obj.username:
            try:
                self._get_by_username(db, username=username)
                raise UsernameAlreadyRegistered()
            except UserNotExists:
                pass
        email = data["email"]
        if email and email != db_obj.email:
            try:
                self._get_by_email(db, email=email)
                raise EmailAlreadyRegistered()
            except UserNotExists:
                pass

    def update(
        self, db: Session, *, db_obj: ModelType, obj_in: Union[UpdateSchemaType, Dict[str, Any]]
    ) -> ModelType:

        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        
        self._validate_update(db, db_obj, update_data)

        if update_data["password"]:
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password
        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def authenticate(self, db: Session, *, username: str, password: str) -> Optional[ModelType]:
        user = self.get_by_username(db, username=username)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def is_active(self, user: ModelType) -> bool:
        return user.is_active

    def is_admin(self, user: User) -> bool:
        return user.type == 'admin'
    
    def is_employee(self, user: User) -> bool:
        return user.type == 'employee'
    
    def is_informant_physician(self, user: User) -> bool:
        return user.type == 'informantphysician'
    
    def tipe(self, user: User) -> str:
        return user.type


class CRUDAdmin(CRUDUser[Admin, AdminCreate, AdminUpdate]):
    def create(self, db: Session, *, obj_in: AdminCreate) -> Admin:
        db_obj = Admin(
            hashed_password=get_password_hash(obj_in.password),
            first_name=obj_in.first_name,
            last_name=obj_in.last_name,
            username=obj_in.username
        )
        return super().create(db, db_obj=db_obj, obj_in=obj_in)


class CRUDInformantPhysician(CRUDUser[InformantPhysician, InformantCreate, InformantUpdate]):

    def create(self, db: Session, *, obj_in: InformantCreate) -> InformantPhysician:
        db_obj = InformantPhysician(
            hashed_password=get_password_hash(obj_in.password),
            first_name=obj_in.first_name,
            last_name=obj_in.last_name,
            username=obj_in.username,
            license=obj_in.license
        )
        return super().create(db, db_obj=db_obj, obj_in=obj_in)


class CRUDEmployee(CRUDUser[Employee, EmployeeCreate, EmployeeUpdate]):

    def create(self, db: Session, *, obj_in: EmployeeCreate) -> Employee:
        db_obj = Employee(
            hashed_password=get_password_hash(obj_in.password),
            first_name=obj_in.first_name,
            last_name=obj_in.last_name,
            username=obj_in.username,
        )
        return super().create(db, db_obj=db_obj, obj_in=obj_in)


class CRUDPatient(CRUDUser[Patient, PatientCreate, PatientUpdate]):

    def create(self, db: Session, *, obj_in: PatientCreate) -> Patient:
        db_obj = Patient(
            first_name=obj_in.first_name,
            last_name=obj_in.last_name,
            username=obj_in.username,
            hashed_password=get_password_hash(obj_in.password),
            email=obj_in.email,
            dni=obj_in.dni,
            birth_date=obj_in.birth_date,
            health_insurance_number=obj_in.health_insurance_number,
            clinical_history=obj_in.clinical_history
        )
        return super().create(db, db_obj=db_obj, obj_in=obj_in)


# falta el configurador


user = CRUDUser(User)

admin = CRUDAdmin(Admin)

employee = CRUDEmployee(Employee)

informant_physician = CRUDInformantPhysician(InformantPhysician)

patient = CRUDPatient(Patient)
