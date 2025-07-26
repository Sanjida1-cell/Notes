from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
from model import Base, Note  # Fixed import

app = FastAPI()

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (frontend)
app.mount("/static", StaticFiles(directory=".", html=True), name="static")

# Create tables
Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic schemas
class NoteCreate(BaseModel):
    title: str
    content: str

class NoteOut(BaseModel):
    id: int
    title: str
    content: str

    class Config:
        from_attributes = True
        orm_mode = True

@app.get("/notes", response_model=list[NoteOut])
def get_notes(db: Session = Depends(get_db)):
    notes = db.query(Note).all()
    return [NoteOut.from_orm(note) for note in notes]

@app.post("/notes", response_model=dict)
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    db_note = Note(title=note.title, content=note.content)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return {"message": "Note saved", "note": NoteOut.from_orm(db_note)}

@app.put("/notes/{note_id}", response_model=dict)
def update_note(note_id: int, note: NoteCreate, db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
        return {"error": "Note not found"}
    db_note.title = note.title
    db_note.content = note.content
    db.commit()
    db.refresh(db_note)
    return {"message": "Note updated", "note": NoteOut.from_orm(db_note)}

@app.delete("/notes/{note_id}", response_model=dict)
def delete_note(note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
        return {"error": "Note not found"}
    db.delete(db_note)
    db.commit()
    return {"message": "Note deleted"}