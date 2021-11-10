from app.models import SampleBatch
from app.schemas import SampleBatchCreate, SampleBatchUpdate
from app.crud.base import CRUDBase
from sqlalchemy.orm import Session
from sqlalchemy.sql import func


class CRUDSampleBatch(CRUDBase[SampleBatch, SampleBatchCreate, SampleBatchUpdate]):
    def update_state(self, db: Session, db_obj: SampleBatch, new_state: str) -> SampleBatch:
        db_obj.current_state = new_state
        date_time = func.now()
        db_obj.updated_date = date_time
        db_obj.current_state_entered_date = date_time

        # TODO: actualizar historico de estado
        db.commit()
        db.refresh(db_obj)
        return db_obj


sample_batch = CRUDSampleBatch(SampleBatch)