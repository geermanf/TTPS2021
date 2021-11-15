from typing import Optional, TYPE_CHECKING
from sqlalchemy import (
    Boolean, Column, Integer, String,
    Text, DateTime, Float, ForeignKey
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
from .diagnosis import Diagnosis
from app.models import Patient, Employee



class TypeStudy(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    study_consent_template = Column(Text, nullable=False)
    studies = relationship(
        "Study", primaryjoin="TypeStudy.id == Study.type_study_id", back_populates="type_study")


class Study(Base):
    id = Column(Integer, primary_key=True, index=True)

    created_date = Column(DateTime(timezone=True), server_default=func.now())
    updated_date = Column(DateTime(timezone=True), onupdate=func.now())

    referring_physician_id = Column(
        Integer, ForeignKey("referringphysician.id"))
    referring_physician = relationship("ReferringPhysician",
                                       primaryjoin="Study.referring_physician_id == ReferringPhysician.id",
                                       back_populates="studies_referred")

    patient_id = Column(Integer, ForeignKey(Patient.id))
    patient = relationship(
        "Patient", primaryjoin="Study.patient_id == Patient.id", back_populates="studies")

    employee_id = Column(Integer, ForeignKey(Employee.id))
    employee = relationship(
        "Employee", primaryjoin="Study.employee_id == Employee.id", back_populates="studies_started")

    type_study_id = Column(Integer, ForeignKey(TypeStudy.id))
    type_study = relationship("TypeStudy",
                              primaryjoin="Study.type_study_id == TypeStudy.id", back_populates="studies")

    presumptive_diagnosis_id = Column(Integer, ForeignKey("diagnosis.id"))
    presumptive_diagnosis = relationship("Diagnosis",
                                         primaryjoin="Study.presumptive_diagnosis_id == Diagnosis.id", back_populates="studies")

    budget = Column(Float)

    past_states = relationship(
        "StudyStates", primaryjoin="Study.id == StudyStates.study_id", back_populates="study")

    report = relationship(
        "Report", primaryjoin="Study.id == Report.study_id", back_populates="study", uselist=False)

    from sqlalchemy_utils import observes
    @observes('current_state')
    def current_state_observer(self, current_state):
        print("state changed") # solo para probar


    current_state = Column(String)
    current_state_entered_date = Column(DateTime(timezone=True))

    sample = relationship("Sample", primaryjoin="Study.id == Sample.study_id",
                          back_populates="study", uselist=False)

    payment_receipt = Column(String)
    signed_consent = Column(String)

    appointment = relationship(
        "Appointment", primaryjoin="Study.id == Appointment.study_id", back_populates="study", uselist=False)

    delayed = Column(Boolean, default=False)