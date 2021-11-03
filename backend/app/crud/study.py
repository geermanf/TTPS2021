from typing import List

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models import Study
from app.schemas import StudyCreate, StudyUpdate


class CRUDStudy(CRUDBase[Study, StudyCreate, StudyUpdate]):
    def create_with_owner(
        self, db: Session, *, obj_in: StudyCreate, employee_id: int
    ) -> Study:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data, employee_id=employee_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        return db_obj

    def get_multi_by_owner(
        self, db: Session, *, employee_id: int, skip: int = 0, limit: int = 100
    ) -> List[Study]:
        return (
            db.query(self.model)
            .filter(Study.employee_id == employee_id)
            .offset(skip)
            .limit(limit)
            .all()
        )


study = CRUDStudy(Study)
