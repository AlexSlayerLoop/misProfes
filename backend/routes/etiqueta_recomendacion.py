from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, String
from typing import List, Optional
from models import EtiquetaRecomendacion as EtiquetaRecomendacionModel
from schemas.etiqueta_recomendacion import EtiquetaRecomendacion, EtiquetaRecomendacionCreate
from db import SessionLocal


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/etiquetas_recomendaciones/", response_model=EtiquetaRecomendacion)
async def create_etiqueta_recomendacion(etiqueta_recomendacion: EtiquetaRecomendacionCreate, db: Session = Depends(get_db)):
    db_etiqueta_recomendacion = EtiquetaRecomendacionModel(id_etiqueta=etiqueta_recomendacion.id_etiqueta, id_recomendacion=etiqueta_recomendacion.id_recomendacion)
    db.add(db_etiqueta_recomendacion)
    db.commit()
    db.refresh(db_etiqueta_recomendacion)
    return db_etiqueta_recomendacion

