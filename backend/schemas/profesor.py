from pydantic import BaseModel
from typing import List, Optional


class ProfesorBase(BaseModel):
    nombres: str
    apellidos: str


class ProfesorCreate(ProfesorBase):
    pass


class Profesor(ProfesorBase):
    id: int

    class Config:
        orm_mode = True
        
        