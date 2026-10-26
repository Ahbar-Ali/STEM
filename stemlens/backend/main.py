import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAIError

from ai_service import (
    check_student_work,
    generate_student_hint,
    teach_student_concept,
    generate_student_solution,
)

from tutor_models import (
    CheckWorkRequest,
    CheckWorkResponse,
    HintRequest,
    HintResponse,
    TeachRequest,
    TeachResponse,
    SolutionRequest,
    SolutionResponse,
)

# Initialize FastAPI application
app = FastAPI()


# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Configure backend logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)


# Health check endpoint
@app.get("/health")
def health():
    return {
        "status": "ok"
    }


# AI Tutor - Check Student Work
@app.post("/check-work", response_model=CheckWorkResponse)
def check_work(request: CheckWorkRequest):

    logger.info(
        "Received check-work request with %d page(s)",
        len(request.pages)
    )

    try:
        # Send student problem and work to AI service
        result = check_student_work(request)

        logger.info(
            "Successfully analyzed student work"
        )

        return result

    except RuntimeError as error:
        # Handle missing API key
        logger.error(
            "AI configuration error: %s",
            error
        )

        raise HTTPException(
            status_code=503,
            detail="AI service is not configured yet."
        ) from error

    except (OpenAIError, ValueError) as error:
        # Handle AI request or response errors
        logger.exception(
            "AI tutoring request failed"
        )

        raise HTTPException(
            status_code=502,
            detail="Unable to analyze student work right now."
        ) from error

    except Exception as error:
        # Catch unexpected backend errors
        logger.exception(
            "Unexpected check-work error"
        )

        raise HTTPException(
            status_code=500,
            detail="An unexpected server error occurred."
        ) from error


@app.post("/hint", response_model=HintResponse)
def get_hint(request: HintRequest):
    logger.info("Received hint request")

    try:
        return generate_student_hint(request)

    except RuntimeError as error:
        logger.error("AI configuration error: %s", error)
        raise HTTPException(
            status_code=503,
            detail="AI service is not configured yet."
        ) from error

    except (OpenAIError, ValueError) as error:
        logger.exception("AI hint request failed")
        raise HTTPException(
            status_code=502,
            detail="Unable to generate a hint right now."
        ) from error

@app.post("/teach", response_model=TeachResponse)
def teach_concept(request: TeachRequest):
    logger.info("Received teaching request")

    try:
        return teach_student_concept(request)

    except RuntimeError as error:
        logger.error("AI configuration error: %s", error)
        raise HTTPException(
            status_code=503,
            detail="AI service is not configured yet."
        ) from error

    except (OpenAIError, ValueError) as error:
        logger.exception("AI teaching request failed")
        raise HTTPException(
            status_code=502,
            detail="Unable to teach this concept right now."
        ) from error

    except Exception as error:
        logger.exception("Unexpected teaching error")
        raise HTTPException(
            status_code=500,
            detail="An unexpected server error occurred."
        ) from error


@app.post("/solution", response_model=SolutionResponse)
def get_solution(request: SolutionRequest):
    logger.info("Received solution request")

    try:
        return generate_student_solution(request)

    except RuntimeError as error:
        logger.error("AI configuration error: %s", error)
        raise HTTPException(
            status_code=503,
            detail="AI service is not configured yet."
        ) from error

    except (OpenAIError, ValueError) as error:
        logger.exception("AI solution request failed")
        raise HTTPException(
            status_code=502,
            detail="Unable to generate a solution right now."
        ) from error

    except Exception as error:
        logger.exception("Unexpected solution error")
        raise HTTPException(
            status_code=500,
            detail="An unexpected server error occurred."
        ) from error
