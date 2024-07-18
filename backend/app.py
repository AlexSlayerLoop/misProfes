from fastapi import FastAPI
from db import engine
from fastapi.middleware.cors import CORSMiddleware
import models
from routes.profesor import router as profesor_router
from routes.materia import router as materia_router


models.Base.metadata.create_all(bind=engine)


app = FastAPI()

app.include_router(profesor_router)
app.include_router(materia_router)


@app.get("/")
def root():
    return {"message": "Hello World"}


