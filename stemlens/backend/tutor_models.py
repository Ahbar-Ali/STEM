from typing import Literal
from pydantic import BaseModel


MistakeType = Literal[
    "arithmetic",
    "algebra",
    "sign_error",
    "conceptual",
    "formula_choice",
    "substitution",
    "derivative",
    "integration",
    "units",
]


class WorkPage(BaseModel):
    pageId: str
    pageName: str
    work: str


class CheckWorkRequest(BaseModel):
    problem: str
    pages: list[WorkPage]


class CheckedStep(BaseModel):
    stepNumber: int
    text: str
    correct: bool
    mistakeType: MistakeType | None = None
    explanation: str
    hint: str | None = None


class PageCheckResult(BaseModel):
    pageId: str
    pageName: str
    firstError: int | None = None
    steps: list[CheckedStep]


class CheckWorkResponse(BaseModel):
    status: Literal["success"]
    pages: list[PageCheckResult]