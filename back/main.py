
from fastapi import FastAPI
from routers import youtube

app = FastAPI()
app.include_router(youtube.router)
