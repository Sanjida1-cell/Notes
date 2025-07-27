# Notes App

A simple full-stack notes application built with FastAPI (Python), SQLAlchemy, and a pure HTML/CSS/JavaScript frontend.

## Features
- Add, view, update, and delete notes
- Responsive and modern UI
- Backend API with full CRUD support
- Uses SQLite or MySQL (configurable in `database.py`)

## Project Structure
```
notes/
├── database.py
├── main.py
├── model.py
├── index.html
├── style.css
├── script.js
```

## Setup Instructions

### 1. Install dependencies
```
pip install fastapi uvicorn sqlalchemy pydantic pymysql
```

### 2. Configure the database
- By default, the app uses the database settings in `database.py`.
- For SQLite, no extra setup is needed.
- For MySQL, ensure the database exists and update the connection string.

### 3. Run the backend server
```
uvicorn main:app --reload
```

### 4. Access the app
- Open your browser and go to: [http://localhost:8000/static/index.html](http://localhost:8000/static/index.html)

## API Endpoints
- `GET /notes` - Get all notes
- `POST /notes` - Create a new note
- `PUT /notes/{note_id}` - Update a note
- `DELETE /notes/{note_id}` - Delete a note

## Frontend
- Pure HTML, CSS, and JavaScript (no frameworks)
- All static files are served from the `/static` path

## License
MIT
