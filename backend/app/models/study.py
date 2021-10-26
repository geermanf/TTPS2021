from sqlalchemy import Boolean, Column, Integer, String, Text, Date

from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey

from app.db.base_class import Base

class Study(Base):
    id = Column(Integer, primary_key=True, index=True)
    result = Column(Boolean(), default=True)
    date_report = Column(Date())
    informant_doctor = relationship("User", back_populates="studies")
    report = relationship("Report", uselist=False, backref="study")



class Report(Base):
    id = Column(Integer, primary_key=True, index=True)
    study_id = Column(Integer, ForeignKey('study.id'))
    result = Column(Text)