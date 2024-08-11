from pydantic import BaseModel


class Materia(BaseModel):
    clave: str
    nombre: str

    class Config:
        orm_mode = True
        
        