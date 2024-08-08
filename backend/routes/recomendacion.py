from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from models import Recomendacion as RecomendacionModel
from schemas.recomendacion import Recomendacion, RecomendacionCreate
from models import Profesor
from db import SessionLocal


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
        
@router.get("/recomendaciones/{profesor_id}", response_model=List[Recomendacion])
async def read_recomendaciones(profesor_id: int, db: Session = Depends(get_db)):
    recomendaciones = db.query(RecomendacionModel).filter(RecomendacionModel.id_profesor == profesor_id).all()
    if not recomendaciones:
        raise HTTPException(status_code=404, detail="No recommendations found for this professor")
    return recomendaciones


@router.post("/recomendaciones/{profesor_id}", response_model=Recomendacion)
async def create_recomendacion(profesor_id: int, recomendacion: RecomendacionCreate, db: Session = Depends(get_db)):
    db_recomendacion = RecomendacionModel(id_profesor=profesor_id, 
                                          clave_materia=recomendacion.clave_materia,
                                          comentario=recomendacion.comentario,
                                          calificacion=recomendacion.calificacion,
                                          facilidad=recomendacion.facilidad)
    db.add(db_recomendacion)
    db.commit()
    db.refresh(db_recomendacion)
    return db_recomendacion