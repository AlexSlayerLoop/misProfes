from pydantic import BaseModel


class Etiqueta(BaseModel):
    id: int
    descripcion: str
    
    class Config:
        orm_mode = True