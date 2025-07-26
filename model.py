from sqlalchemy import Column, Integer, String
from database import Base

class Note(Base):
    __tablename__ = "notes"  # Fixed typo: double underscore before and after

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100))
    content = Column(String(500))