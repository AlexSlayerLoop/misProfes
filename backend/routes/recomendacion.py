from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from models import Recomendacion as RecomendacionModel
from schemas.recomendacion import Recomendacion
from models import Profesor
from db import SessionLocal


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
        
@router.get("/profesor/{profesor_id}/recomendaciones", response_model=List[Recomendacion])
def read_recomendaciones(profesor_id: int, db: Session = Depends(get_db)):
    recomendaciones = db.query(RecomendacionModel).filter(RecomendacionModel.id_profesor == profesor_id).all()
    if not recomendaciones:
        raise HTTPException(status_code=404, detail="No recommendations found for this professor")
    return recomendaciones

