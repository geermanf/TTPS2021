from typing import Any, Dict, Optional, Union

from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase, ModelType, CreateSchemaType, UpdateSchemaType
from app.models import User, Admin, Employee, Patient
from app.schemas import (
    AdminCreate, AdminUpdate,
    EmployeeCreate, EmployeeUpdate,
    PatientCreate, PatientUpdate
)

class CRUDUser(CRUDBase[ModelType, CreateSchemaType, UpdateSchemaType]):
    def get_by_username(self, db: Session, *, username: str) -> Optional[ModelType]:
        return db.query(self.model).filter(self.model.username == username).first()

    def update(
        self, db: Session, *, db_obj: ModelType, obj_in: Union[UpdateSchemaType, Dict[str, Any]]
    ) -> ModelType:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
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


class CRUDAdmin(CRUDUser[Admin, AdminCreate, AdminUpdate]):
    def create(self, db: Session, *, obj_in: AdminCreate) -> Admin: #fix validation
        db_obj = Admin(
            hashed_password=get_password_hash(obj_in.password),
            first_name=obj_in.first_name,
            last_name=obj_in.last_name,
            username=obj_in.username
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

class CRUDEmployee(CRUDUser[Employee, EmployeeCreate, EmployeeUpdate]): #fix validation

    def create(self, db: Session, *, obj_in: EmployeeCreate) -> Employee:
        db_obj = Employee(
            hashed_password=get_password_hash(obj_in.password),
            first_name=obj_in.first_name,
            last_name=obj_in.last_name,
            username=obj_in.username,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


class CRUDPatient(CRUDUser[Patient, PatientCreate, PatientUpdate]): #fix validation

    def create(self, db: Session, *, obj_in: PatientCreate) -> Patient:
        db_obj = Patient(
            hashed_password=get_password_hash(obj_in.password),
            first_name=obj_in.first_name,
            last_name=obj_in.last_name,
            username=obj_in.username,
            email=obj_in.email,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


admin = CRUDAdmin(Admin)

user = CRUDUser(User)

employee = CRUDEmployee(Employee)

patient = CRUDPatient(Patient)
