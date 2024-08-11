from pydantic import BaseModel
from typing import List, Optional


class ProfesorBase(BaseModel):
    nombres: str
    apellidos: str


class ProfesorCreate(ProfesorBase):
    pass


class Profesor(ProfesorBase):
    id: int
    promedio: Optional[str] = None
    facilidad: Optional[str] = None
    
    class Config:
        orm_mode = True
        
        