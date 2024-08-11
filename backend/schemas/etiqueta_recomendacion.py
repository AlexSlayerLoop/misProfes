from pydantic import BaseModel


class EtiquetaRecomendacionBase(BaseModel):
    id_etiqueta: int
    id_recomendacion: int


class EtiquetaRecomendacionCreate(EtiquetaRecomendacionBase):
    pass


class EtiquetaRecomendacion(EtiquetaRecomendacionBase):
    class Config:
        orm_mode = True

