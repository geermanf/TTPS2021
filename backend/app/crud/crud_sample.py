from sqlalchemy.orm import Session
from app.models import Sample, Study
from app.schemas import SampleCreate, SampleUpdate
from app.crud.base import CRUDBase
from typing import Dict, Union, Any
from app.crud.exceptions import *


class CRUDSample(CRUDBase[Sample, SampleCreate, SampleUpdate]):
    def create(
        self, db: Session, study_id: int, obj_in: Union[SampleCreate, Dict[str, Any]]
    ) -> Sample:

        if False: # TODO: implementar
            raise StudyAlreadyWithSample()
        if isinstance(obj_in, dict):
            create_data = obj_in
        else:
            create_data = obj_in.dict(exclude_unset=True)

        db_obj = self.model(**create_data, study_id=study_id)

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


sample = CRUDSample(Sample)