from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CheckWorkRequest(BaseModel):
    problem: str
    work: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/check-work")
def check_work(request: CheckWorkRequest):
    return {
        "status": "success",
        "problem": request.problem,
        "work": request.work,
        "feedback": {
            "message": "Work received successfully.",
            "first_error": None
        }
    }
