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
    from .study_updates import StudyHistory  # noqa: F401


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
    # subclases de User no pueden tener NOT NULL constraint.
    # Se los fuerza en los squemas (los llamados "pydantic models")
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


class InformantPhysician(User):
    # (*) en squema.InformantCreate se asegura
    # el NOT NULL constraint en el campo

    __tablename__ = None

    license = Column(Integer, nullable=True)  # *
    reports = relationship(
        "Report", primaryjoin="InformantPhysician.id == Report.informant_physician_id", back_populates="informant_physician")
    __mapper_args__ = {
        'polymorphic_identity': 'informantphysician'
    }


class Patient(User):
    # (*) en squema.PatientCreate se asegura
    # el NOT NULL constraint en los campos

    __tablename__ = None
    email = Column(String, unique=True, index=True, nullable=True)  # *
    dni = Column(Integer, nullable=True)  # *
    birth_date = Column(Date(), nullable=True)  # *
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

    studies_started = relationship(
        "Study", primaryjoin="Employee.id == Study.employee_id", back_populates="patient")

    studies_updated = relationship(
        "StudyHistory", primaryjoin="Employee.id==StudyHistory.employee_id", back_populates="employee")

    __mapper_args__ = {
        'polymorphic_identity': 'employee'
    }
