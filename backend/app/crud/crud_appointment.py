from sqlalchemy.orm import Session
from app.models import Appointment, Study
from app.schemas import AppointmentCreate, AppointmentUpdate
from app.crud.base import CRUDBase
from typing import Dict, Union, Any
from app.crud.exceptions import StudyAlreadyWithAppointment


class CRUDAppointment(CRUDBase[Appointment, AppointmentCreate, AppointmentUpdate]):
    def create(
        self, db: Session, study_id: int, obj_in: Union[AppointmentCreate, Dict[str, Any]]
    ) -> Appointment:

        if False: # TODO: implementar
            raise StudyAlreadyWithAppointment()
        if isinstance(obj_in, dict):
            create_data = obj_in
        else:
            create_data = obj_in.dict(exclude_unset=True)

        db_obj = self.model(**create_data, study_id=study_id)

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


appointment = CRUDAppointment(Appointment)