from fastapi import FastAPI
from db import engine
from fastapi.middleware.cors import CORSMiddleware
import models
from routes.profesor import router as profesor_router
from routes.materia import router as materia_router
from routes.etiqueta import router as etiqueta_router
from routes.recomendacion import router as recomendacion_router

models.Base.metadata.create_all(bind=engine)


app = FastAPI()


app.include_router(profesor_router)
app.include_router(materia_router)
app.include_router(etiqueta_router)
app.include_router(recomendacion_router)  


origins = ["http://127.0.0.1:5500"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Hello World"}


