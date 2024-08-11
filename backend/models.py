from sqlalchemy import Column, Integer, String, ForeignKey, CheckConstraint
from db import Base
from sqlalchemy.orm import relationship


class Profesor(Base):
    __tablename__ = 'profesores'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombres = Column(String, nullable=False)
    apellidos = Column(String, nullable=False)
    recomendaciones = relationship("Recomendacion", back_populates="profesor")
    materias = relationship("MateriaProfesor", back_populates="profesor")


class Materia(Base):
    __tablename__ = 'materias'
    clave = Column(String, primary_key=True)
    nombre = Column(String, nullable=False)
    profesores = relationship("MateriaProfesor", back_populates="materia")


class MateriaProfesor(Base):
    __tablename__ = 'materias_profesores'
    id_profesor = Column(Integer, ForeignKey('profesores.id'), primary_key=True)
    clave_materia = Column(String, ForeignKey('materias.clave'), primary_key=True)
    profesor = relationship("Profesor", back_populates="materias")
    materia = relationship("Materia", back_populates="profesores")


class Recomendacion(Base):
    __tablename__ = 'recomendaciones'
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_profesor = Column(Integer, ForeignKey('profesores.id'), nullable=False)
    clave_materia = Column(String, ForeignKey('materias.clave'), nullable=False)
    comentario = Column(String, nullable=False)
    calificacion = Column(Integer, CheckConstraint('calificacion >= 0 AND calificacion <= 10'), nullable=False)
    facilidad = Column(Integer, CheckConstraint('facilidad >= 0 AND facilidad <= 10'), nullable=False)
    profesor = relationship("Profesor", back_populates="recomendaciones")
    etiquetas = relationship("EtiquetaRecomendacion", back_populates="recomendacion")


class Etiqueta(Base):
    __tablename__ = 'etiquetas'
    id = Column(Integer, primary_key=True, autoincrement=True)
    descripcion = Column(String, nullable=False)
    recomendaciones = relationship("EtiquetaRecomendacion", back_populates="etiqueta")


class EtiquetaRecomendacion(Base):
    __tablename__ = 'etiquetas_recomendaciones'
    id_etiqueta = Column(Integer, ForeignKey('etiquetas.id'), primary_key=True)
    id_recomendacion = Column(Integer, ForeignKey('recomendaciones.id'), primary_key=True)
    etiqueta = relationship("Etiqueta", back_populates="recomendaciones")
    recomendacion = relationship("Recomendacion", back_populates="etiquetas")
