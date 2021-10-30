from collections import defaultdict
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean, Column, ForeignKey,
    Integer, String, Date, Text, event
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from enum import Enum

from app.db.base_class import Base

if TYPE_CHECKING:
    from .health_insurance import HealthInsurance  # noqa: F401
    from .study import Study  # noqa: F401


def receive_mapper_configured(mapper, class_):
    mapper.polymorphic_map = defaultdict(
        lambda: mapper, mapper.polymorphic_map)
    # to prevent 'incompatible polymorphic identity' warning, not necessary
    mapper._validate_polymorphic_identity = None


def polymorphic_fallback(mapper_klass):
    event.listens_for(mapper_klass, 'mapper_configured')(
        receive_mapper_configured)
    return mapper_klass


@polymorphic_fallback  # https://stackoverflow.com/a/50983187
class User(Base):
    # NOTA: al aplicarse Single table inheritance,
    # subclases de User no pueden tener campos not null
    # forzarlo en los squemas
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean(), default=True)

    __mapper_args__ = {
        'polymorphic_on': 'type',
        'polymorphic_identity': 'user'
    }


class Admin(User):
    __tablename__ = None

    __mapper_args__ = {
        'polymorphic_identity': 'admin'
    }


class Config(User):
    __tablename__ = None

    __mapper_args__ = {
        'polymorphic_identity': 'config'
    }

class InformantDoctor(User):
    __tablename__ = None

    # asegurar en el squema que no sea null
    licence = Column(Integer, nullable=True)
    studies_informed = relationship(
        "Study", primaryjoin="InformantDoctor.id == Study.informant_doctor_id", back_populates="informant_doctor")
    __mapper_args__ = {
        'polymorphic_identity': 'informantdoctor'
    }


class Patient(User):
    __tablename__ = None
    # asegurar en el squema que no sea null
    email = Column(String, unique=True, index=True, nullable=True)
    # asegurar en el squema que no sea null
    dni = Column(Integer, nullable=True)
    # asegurar en el squema que no sea null
    birth_date = Column(Date(), nullable=True)
    health_insurance_number = Column(Integer)
    health_insurance_id = Column(Integer, ForeignKey("healthinsurance.id"))
    health_insurance = relationship(
        "HealthInsurance", back_populates="affiliates")
    studies = relationship(
        "Study", primaryjoin="Patient.id == Study.patient_id", back_populates="patient")
    clinical_history = Column(Text)

    __mapper_args__ = {
        'polymorphic_identity': 'patient'
    }


class Employee(User):
    __tablename__ = None
    # algo con los estudios...
    # una tabla cn el empleado y los estudios de los que cambio el estado
    __mapper_args__ = {
        'polymorphic_identity': 'employee'
    }
