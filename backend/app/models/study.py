from typing import TYPE_CHECKING
from sqlalchemy import Boolean, Column, Integer, String, Text, Date

from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey

from app.db.base_class import Base

from .user import InformantDoctor, Patient

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


class Study(Base):
    id = Column(Integer, primary_key=True, index=True)
    result = Column(Boolean(), default=True)  # dudaa, capaz string
    date_report = Column(Date())
    informant_doctor_id = Column(Integer, ForeignKey(InformantDoctor.id))
    informant_doctor = relationship(InformantDoctor, primaryjoin=informant_doctor_id ==
                                    InformantDoctor.id, back_populates="studies_informed")
    patient_id = Column(Integer, ForeignKey(Patient.id))
    patient = relationship(Patient, primaryjoin=patient_id ==
                           Patient.id, back_populates="studies")
    report = Column(Text)
    state = Column(ChoiceType(StudyState, impl=String()))
