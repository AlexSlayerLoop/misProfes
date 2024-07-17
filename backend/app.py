from fastapi import FastAPI
from db import engine
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


@app.get("/")
def root():
    return {"message": "Hello World"}


