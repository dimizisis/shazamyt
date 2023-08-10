
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import youtube

app = FastAPI()
app.include_router(youtube.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)