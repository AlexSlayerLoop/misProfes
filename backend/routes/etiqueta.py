from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from models import Etiqueta as EtiquetaModel
from schemas.etiqueta import Etiqueta
from db import SessionLocal


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        

@router.get("/etiquetas/", response_model=List[Etiqueta])
async def read_etiquetas(skip: int = 0, limit: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(EtiquetaModel).offset(skip)
    if limit:
        query = query.limit(limit)
    etiquetas = query.all()
    return etiquetas