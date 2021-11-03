

from sqlalchemy import Boolean, Column, Integer, String, Text, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.sql import func
from sqlalchemy_utils import ChoiceType
from app.db.base_class import Base
from app.models import StudyState, Employee, InformantPhysician


class StudyHistory(Base):
    id = Column(Integer, primary_key=True, index=True)
    study_id = Column(Integer, ForeignKey("study.id"))
    study = relationship("Study", primaryjoin="StudyHistory.study_id == Study.id", back_populates="history")
    state = Column(ChoiceType(StudyState, impl=String()))
    state_entered_date = Column(DateTime(timezone=True))
    employee_id = Column(Integer, ForeignKey(Employee.id))
    employee = relationship("Employee", primaryjoin="StudyHistory.employee_id == Employee.id", back_populates="studies_updated")



class Report(Base):
    id = Column(Integer, primary_key=True, index=True)
    study_id = Column(Integer, ForeignKey("study.id"))
    study = relationship("Study", primaryjoin="Report.study_id == Study.id", back_populates="report")

    informant_physician_id = Column(Integer, ForeignKey(InformantPhysician.id))
    informant_physician = relationship("InformantPhysician", primaryjoin="Report.informant_physician_id == InformantPhysician.id", back_populates="reports")

    result = Column(String(), default=False)
    date_report = Column(DateTime(), server_default=func.now())
    report = Column(Text)