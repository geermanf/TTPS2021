from typing import TYPE_CHECKING
from sqlalchemy import Boolean, Column, Integer, String, Text, Date

from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.sql import func
from app.db.base_class import Base

from .user import InformantPhysician, Patient
from .referring_physician import ReferringPhysician
from enum import Enum

from sqlalchemy_utils import ChoiceType


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
    result = Column(Boolean(), default=True)  # dudaa, capaz string

    informant_physician_id = Column(Integer, ForeignKey(InformantPhysician.id))
    informant_physician = relationship(InformantPhysician, primaryjoin=informant_physician_id ==
                                    InformantPhysician.id, back_populates="studies_informed")
    patient_id = Column(Integer, ForeignKey(Patient.id))

    date_report = Column(Date())
    created_date = Column(Date(), default=func.now())

    # presumptive_diagnosis

    referring_physician_id = Column(Integer, ForeignKey(ReferringPhysician.id))
    referring_physician = relationship(ReferringPhysician, primaryjoin=referring_physician_id ==
                                                                 ReferringPhysician.id, back_populates="studies_referred")

    patient_id = Column(Integer, ForeignKey(Patient.id))
    patient = relationship(Patient, primaryjoin=patient_id ==
                                                Patient.id, back_populates="studies")

    type_study_id = Column(Integer, ForeignKey(TypeStudy.id))
    type_study = relationship(TypeStudy, primaryjoin=type_study_id ==
                                                TypeStudy.id, back_populates="studies")

    report = Column(Text)
    state = Column(ChoiceType(StudyState, impl=String()))
