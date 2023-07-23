
from fastapi import FastAPI
from routers import youtube

app = FastAPI()
app.include_router(youtube.router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host='localhost', port=8000)