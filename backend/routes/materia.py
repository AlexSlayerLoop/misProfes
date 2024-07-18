from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from models import Materia as MateriaModel
from schemas.materia import Materia
from db import SessionLocal


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
        
@router.get("/materias/", response_model=List[Materia])
async def read_materias(skip: int = 0, limit: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(MateriaModel).offset(skip)
    if limit:
        query = query.limit(limit)
    materias = query.all()
    return materias

