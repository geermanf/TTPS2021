from sqlalchemy import Column, Integer, String, DateTime
from app.db.base_class import Base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from typing import Final
from sqlalchemy.orm import Session
from app.models import Study, Sample
from app.constants.state import StudyState, SampleBatchState


class SampleBatch(Base):
    BATCH_SIZE: Final = 10
    id = Column(Integer, primary_key=True, index=True)
    created_date = Column(DateTime(timezone=True), server_default=func.now())
    updated_date = Column(DateTime(timezone=True), onupdate=func.now()) # TODO: evaluar si deprecated
    current_state = Column(String, default=SampleBatchState.STATE_ONE)
    current_state_entered_date = Column(DateTime(timezone=True))
    url = Column(String)
    samples = relationship(
        "Sample", primaryjoin="SampleBatch.id == Sample.sample_batch_id",
        back_populates="sample_batch")

    @classmethod
    def new_if_qualifies(cls, new_state: str, db: Session):
        if new_state == StudyState.STATE_SEVEN:
            samples = db.query(Sample).join(Study).filter(
                Study.current_state == new_state
            ).all()
            if len(samples) == cls.BATCH_SIZE:
                batch = cls()
                db.add(batch)
                for sample in samples:
                    sample.sample_batch = batch
                    sample.study.current_state = StudyState.STATE_EIGHT
