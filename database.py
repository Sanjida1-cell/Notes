from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Replace with your MySQL username, password, host, port, and db name
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:s1160s2186@localhost:3306/notes_app"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()