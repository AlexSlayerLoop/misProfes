from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, String
from typing import List, Optional
from models import MateriaProfesor as MateriaProfesorModel          
from schemas.materia_profesor import MateriaProfesor, MateriaProfesorCreate
from db import SessionLocal


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/materias_profesores/", response_model=MateriaProfesor)
async def create_materia_profesor(materia_profesor: MateriaProfesorCreate, db: Session = Depends(get_db)):
    db_materia_profesor = MateriaProfesorModel(clave_materia=materia_profesor.clave_materia, id_profesor=materia_profesor.id_profesor)
    db.add(db_materia_profesor)
    db.commit()
    db.refresh(db_materia_profesor)
    return db_materia_profesor


@router.get("/materias_profesores/{clave_materia}", response_model=List[MateriaProfesor])
async def read_materias_profesores(clave_materia: str, skip: int = 0, limit: Optional[int] = 0, db: Session = Depends(get_db)):
    query = db.query(MateriaProfesorModel).filter(MateriaProfesorModel.clave_materia == clave_materia)
    if limit:
        query = query.limit(limit)
    materias_profesores = query.offset(skip).all()
    return materias_profesores


@router.get("/materias_profesores/exists/{clave_materia}/{id_profesor}", response_model=bool)
async def exists_materia_profesor(clave_materia: str, id_profesor: int, db: Session = Depends(get_db)):
    query = db.query(MateriaProfesorModel).filter(
        MateriaProfesorModel.clave_materia == clave_materia,
        MateriaProfesorModel.id_profesor == id_profesor
    )
    exists = db.query(query.exists()).scalar()
    return exists