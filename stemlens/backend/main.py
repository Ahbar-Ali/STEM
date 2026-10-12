from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from tutor_models import CheckWorkRequest, CheckWorkResponse

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


@app.post("/check-work", response_model=CheckWorkResponse)
def check_work(request: CheckWorkRequest):
    print("Problem:", request.problem)

    for page in request.pages:
        print("Page:", page.pageName)
        print("Work:", page.work)

    return {
        "status": "success",
        "pages": [
            {
                "pageId": page.pageId,
                "pageName": page.pageName,
                "firstError": 2,
                "steps": [
                    {
                        "stepNumber": 1,
                        "text": "2x = 8",
                        "correct": True,
                        "mistakeType": None,
                        "explanation": "This step is correct.",
                        "hint": None,
                    },
                    {
                        "stepNumber": 2,
                        "text": "x = 8",
                        "correct": False,
                        "mistakeType": "algebra",
                        "explanation": "You need to divide both sides by 2.",
                        "hint": "What operation would isolate x?",
                    },
                ],
            }
            for page in request.pages
        ],
    }