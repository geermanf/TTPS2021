from typing import Optional, TYPE_CHECKING
from sqlalchemy import Boolean, Column, Integer, String, Text, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.sql import func
from app.db.base_class import Base
from .diagnosis import Diagnosis
from enum import Enum

from sqlalchemy_utils import ChoiceType
from app.models import Patient, Employee

class StudyState(Enum):
    state_one = "esperando_comprobante"
    state_one_error = "anulado_falta_pago"
    state_two = "enviar_consentimiento"
    state_three = "esperando_consentimiento_firmado"
    state_four = "esperando_seleccion_turno"
    state_five = "esperando_toma_muestra"
    state_six = "esperando_retirno_muestra"
    state_seven = "esperando_ingresar_a_lote"
    state_eight = "esperando_resultado"
    state_nine = "esperando_interpretacion"
    state_ten = "esperando_enviar_a_derivante"
    state_ended = "resultado_emtregado"


class TypeStudy(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    study_consent_template = Column(String, unique=True, nullable=False)
    studies = relationship(
        "Study", primaryjoin="TypeStudy.id == Study.type_study_id", back_populates="type_study")


class Study(Base):
    id = Column(Integer, primary_key=True, index=True)

    created_date = Column(DateTime(timezone=True), server_default=func.now())
    updated_date = Column(DateTime(timezone=True), onupdate=func.now())

    referring_physician_id = Column(Integer, ForeignKey("referringphysician.id"))
    referring_physician = relationship("ReferringPhysician",
                                       primaryjoin="Study.referring_physician_id == ReferringPhysician.id",
                                       back_populates="studies_referred")

    patient_id = Column(Integer, ForeignKey(Patient.id))
    patient = relationship("Patient", primaryjoin="Study.patient_id == Patient.id", back_populates="studies")
    
    employee_id = Column(Integer, ForeignKey(Employee.id))
    employee = relationship("Employee", primaryjoin="Study.employee_id == Employee.id", back_populates="studies_started")

    type_study_id = Column(Integer, ForeignKey(TypeStudy.id))
    type_study = relationship("TypeStudy",
                              primaryjoin="Study.type_study_id == TypeStudy.id", back_populates="studies")

    presumptive_diagnosis_id = Column(Integer, ForeignKey("diagnosis.id"))
    presumptive_diagnosis = relationship("Diagnosis",
                                         primaryjoin="Study.presumptive_diagnosis_id == Diagnosis.id", back_populates="studies")

    budget = Column(Float)

    history = relationship(
        "StudyHistory", primaryjoin="Study.id == StudyHistory.study_id", back_populates="study")

    report = relationship(
        "Report", primaryjoin="Study.id==Report.study_id", back_populates="study", uselist=False)


    current_state = Column(ChoiceType(StudyState, impl=String()))
    current_state_entered_date = Column(DateTime(timezone=True))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.current_state = StudyState.state_one


    # tal vez en init
    def create_history(self, employee_id: int, state: Optional[str] = None):
        from app.models import StudyHistory
        study_history = StudyHistory(
            study_id=self.id,
            employee_id=employee_id,
            state=state
        )
        return study_history

