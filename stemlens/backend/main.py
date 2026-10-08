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


class WorkPage(BaseModel):
    page_id: str
    page_name: str
    work: str


class CheckWorkRequest(BaseModel):
    problem: str
    pages: list[WorkPage]


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


@app.post("/check-work")
def check_work(request: CheckWorkRequest):
    print("Problem:", request.problem)

    for page in request.pages:
        print("Page:", page.page_name)
        print("Work:", page.work)

    return {
        "status": "success",
        "first_error": 2,
        "steps": [
            {
                "step_number": 1,
                "text": "2x = 8",
                "correct": True,
                "mistake_type": None,
                "explanation": "This step is correct.",
                "hint": None,
            },
            {
                "step_number": 2,
                "text": "x = 8",
                "correct": False,
                "mistake_type": "algebra",
                "explanation": "You need to divide both sides by 2.",
                "hint": "What operation would isolate x?",
            },
        ],
    }