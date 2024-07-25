from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, String
from typing import List, Optional
from models import Profesor as ProfesorModel, Recomendacion as RecomendacionModel
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
    query = db.query(
        ProfesorModel.id,
        ProfesorModel.nombres,
        ProfesorModel.apellidos,
        func.coalesce(
            func.round(
                func.avg(RecomendacionModel.calificacion), 
            2).cast(String),
        'None').label('promedio')
    ).outerjoin(RecomendacionModel, ProfesorModel.id == RecomendacionModel.id_profesor
    ).group_by(ProfesorModel.id, ProfesorModel.nombres, ProfesorModel.apellidos).offset(skip)

    if limit:
        query = query.limit(limit)

    profesores = query.all()
    return profesores


@router.get("/profesores/{profesor_id}", response_model=Profesor)
async def read_profesor(profesor_id: int, db: Session = Depends(get_db)):
    profesor = db.query(
        ProfesorModel.id,
        ProfesorModel.nombres,
        ProfesorModel.apellidos,
        func.coalesce(
            func.round(
                func.avg(RecomendacionModel.calificacion), 
            2).cast(String),
        'None').label('promedio'),
        func.coalesce(
            func.round(
                func.avg(RecomendacionModel.facilidad), 
            2).cast(String),
        'None').label('facilidad')
    ).outerjoin(RecomendacionModel, ProfesorModel.id == RecomendacionModel.id_profesor
    ).filter(ProfesorModel.id == profesor_id
    ).group_by(ProfesorModel.id, ProfesorModel.nombres, ProfesorModel.apellidos
    ).first()

    if profesor is None:
        raise HTTPException(status_code=404, detail="Profesor not found")

    return profesor


@router.post("/profesores/", response_model=Profesor)
async def create_profesor(profesor: ProfesorCreate, db: Session = Depends(get_db)):
    db_profesor = ProfesorModel(nombres=profesor.nombres, apellidos=profesor.apellidos)
    db.add(db_profesor)
    db.commit()
    db.refresh(db_profesor)
    return db_profesor

