from uuid import uuid4
from app.db.base_class import Base
from sqlalchemy import Column, String, Text, Integer


class Role(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)