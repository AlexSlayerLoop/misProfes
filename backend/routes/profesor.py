from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from models import Profesor as ProfesorModel
from schemas.profesor import Profesor, ProfesorCreate
from db import SessionLocal


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        

@router.get("/profesores/", response_model=List[Profesor])
async def read_profesores(skip: int = 0, limit: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(ProfesorModel).offset(skip)
    if limit:
        query = query.limit(limit)
    profesores = query.all()
    return profesores


@router.post("/profesores/", response_model=Profesor)
async def create_profesor(profesor: ProfesorCreate, db: Session = Depends(get_db)):
    db_profesor = ProfesorModel(nombres=profesor.nombres, apellidos=profesor.apellidos)
    db.add(db_profesor)
    db.commit()
    db.refresh(db_profesor)
    return db_profesor

