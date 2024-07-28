from pydantic import BaseModel


class MateriaProfesorBase(BaseModel):
    clave_materia: str
    id_profesor: int
    

class MateriaProfesorCreate(MateriaProfesorBase):
    pass


class MateriaProfesor(MateriaProfesorBase):
    class Config:
        orm_mode = True
        
