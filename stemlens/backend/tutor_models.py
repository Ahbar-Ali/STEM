
from typing import Literal
from pydantic import BaseModel, Field


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
    work: str = ""
    imageData: str | None = Field(
        default=None,
        max_length=4_000_000,
    )


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


class HintRequest(BaseModel):
    problem: str
    pages: list[WorkPage]


class HintResponse(BaseModel):
    title: str
    hint: str
    nextQuestion: str


class TeachRequest(BaseModel):
    problem: str
    pages: list[WorkPage]


class LessonSection(BaseModel):
    title: str
    explanation: str


class TeachResponse(BaseModel):
    concept: str
    summary: str
    lessons: list[LessonSection]
    formula: str | None = None


class SolutionRequest(BaseModel):
    problem: str
    pages: list[WorkPage]


class SolutionStep(BaseModel):
    stepNumber: int
    explanation: str
    expression: str


class SolutionResponse(BaseModel):
    summary: str
    steps: list[SolutionStep]
    finalAnswer: str
