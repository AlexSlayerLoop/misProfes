from pydantic import BaseModel
from typing import List

class RecomendacionBase(BaseModel):
    comentario: str
    calificacion: int
    facilidad: int


class RecomendacionCreate(RecomendacionBase):
    pass


class Recomendacion(RecomendacionBase):
    id: int
    id_profesor: int
    
    class Config:
        orm_mode = True