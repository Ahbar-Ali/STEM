import { useEffect, useMemo, useState } from "react";

import "../styles/AITutor.css";

import {
  mockCheckWork,
  mockGetHint,
  mockGetSolution,
  mockTeach,
} from "../services/mockAiService";

import type {
  CheckWorkResponse,
  HintResponse,
  SelectedWorkPage,
  SolutionResponse,
  TeachResponse,
  TutorMode,
  WorkspacePageData,
} from "../types/ai.Tutor";

type AITutorProps = {
  problem: string;
  work: string;
  pages: WorkspacePageData[];
  activePageId: string;
};

function AITutor({
  problem,
  pages,
  activePageId,
}: AITutorProps) {
  const [mode, setMode] =
    useState<TutorMode>("idle");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [selectedPageIds, setSelectedPageIds] =
    useState<string[]>([]);

  const [checkResult, setCheckResult] =
    useState<CheckWorkResponse | null>(null);

  const [hintResult, setHintResult] =
    useState<HintResponse | null>(null);

  const [teachResult, setTeachResult] =
    useState<TeachResponse | null>(null);

  const [solutionResult, setSolutionResult] =
    useState<SolutionResponse | null>(null);

  const pagesWithWork = useMemo(
    () =>
      pages.filter(
        (page) => page.work.trim().length > 0
      ),
    [pages]
  );

  const selectedPages: SelectedWorkPage[] =
    useMemo(() => {
      return pages
        .filter((page) =>
          selectedPageIds.includes(page.id)
        )
        .filter(
          (page) =>
            page.work.trim().length > 0
        )
        .map((page) => ({
          pageId: page.id,
          pageName: page.name,
          work: page.work,
        }));
    }, [pages, selectedPageIds]);

  useEffect(() => {
    if (!activePageId) {
      return;
    }

    const activePage = pages.find(
      (page) => page.id === activePageId
    );

    if (!activePage) {
      return;
    }

    if (!activePage.work.trim()) {
      return;
    }

    setSelectedPageIds([activePageId]);
  }, [activePageId, pages]);

  useEffect(() => {
    setSelectedPageIds((previous) =>
      previous.filter((pageId) =>
        pages.some(
          (page) =>
            page.id === pageId &&
            page.work.trim().length > 0
        )
      )
    );
  }, [pages]);

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const goHome = () => {
    setMode("idle");
    resetMessages();
  };

  const togglePage = (pageId: string) => {
    setSelectedPageIds((previous) => {
      if (previous.includes(pageId)) {
        return previous.filter(
          (id) => id !== pageId
        );
      }

      return [...previous, pageId];
    });
  };

  const selectAllPages = () => {
    setSelectedPageIds(
      pagesWithWork.map((page) => page.id)
    );
  };

  const clearSelectedPages = () => {
    setSelectedPageIds([]);
  };

  const hasSelectedWork =
    selectedPages.length > 0;

  const canUseAI =
    problem.trim().length > 0 &&
    hasSelectedWork &&
    !loading;

  const handleCheckWork = async () => {
    if (!canUseAI) {
      return;
    }

    setLoading(true);
    resetMessages();
    setCheckResult(null);

    try {
      const result = await mockCheckWork({
        problem,
        pages: selectedPages,
      });

      setCheckResult(result);

      setSuccess(
        "Your selected pages were checked successfully."
      );

      setMode("check");
    } catch (err) {
      console.error(err);

      setError(
        "STEMLens could not check your work. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGiveHint = async () => {
    if (!canUseAI) {
      return;
    }

    setLoading(true);
    resetMessages();
    setHintResult(null);

    try {
      const result = await mockGetHint({
        problem,
        pages: selectedPages,
      });

      setHintResult(result);
      setMode("hint");
    } catch (err) {
      console.error(err);

      setError(
        "STEMLens could not generate a hint."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTeach = async () => {
    if (!canUseAI) {
      return;
    }

    setLoading(true);
    resetMessages();
    setTeachResult(null);

    try {
      const result = await mockTeach({
        problem,
        pages: selectedPages,
      });

      setTeachResult(result);
      setMode("teach");
    } catch (err) {
      console.error(err);

      setError(
        "STEMLens could not generate the explanation."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleShowSolution = async () => {
    if (!canUseAI) {
      return;
    }

    setLoading(true);
    resetMessages();
    setSolutionResult(null);

    try {
      const result = await mockGetSolution({
        problem,
        pages: selectedPages,
      });

      setSolutionResult(result);
      setMode("solution");
    } catch (err) {
      console.error(err);

      setError(
        "STEMLens could not generate the solution."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedCount =
    selectedPageIds.length;

  const allSelected =
    pagesWithWork.length > 0 &&
    selectedCount === pagesWithWork.length;

  const hasProblem =
    problem.trim().length > 0;

  return (
    <aside className="ai-panel">
      <div className="ai-tutor-header">
        <div>
          <p className="ai-eyebrow">
            STEMLens
          </p>

          <h2>AI Tutor</h2>
        </div>

        <div className="ai-status">
          <span className="ai-status-dot" />
          Ready
        </div>
      </div>

      <div className="concept-card">
        <span>Detected concept</span>

        <strong>
          {hasProblem
            ? "Problem detected"
            : "No problem yet"}
        </strong>
      </div>

      {mode === "idle" && (
        <div className="ai-home">
          <p className="ai-helper-text">
            Select the pages you want STEMLens
            to use, then choose how you want
            help.
          </p>

          {!hasProblem && (
            <div className="ai-error-card">
              <strong>
                Add a problem first
              </strong>

              <p>
                Enter the STEM problem above
                before using the AI Tutor.
              </p>
            </div>
          )}

          {hasProblem && (
            <div className="page-check-selector">
              <div className="page-check-header">
                <span>
                  Pages to include
                </span>

                <button
                  type="button"
                  className="select-all-btn"
                  onClick={
                    allSelected
                      ? clearSelectedPages
                      : selectAllPages
                  }
                >
                  {allSelected
                    ? "Clear"
                    : "Select All"}
                </button>
              </div>

              <div className="page-check-list">
                {pages.map((page) => {
                  const hasWork =
                    page.work.trim().length >
                    0;

                  const selected =
                    selectedPageIds.includes(
                      page.id
                    );

                  return (
                    <label
                      key={page.id}
                      className={
                        hasWork
                          ? "page-check-option"
                          : "page-check-option disabled"
                      }
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        disabled={!hasWork}
                        onChange={() =>
                          togglePage(page.id)
                        }
                      />

                      <span>
                        {page.name}

                        {page.id ===
                          activePageId &&
                          " · Current"}
                      </span>
                    </label>
                  );
                })}
              </div>

              {pages.length > 0 &&
                pagesWithWork.length === 0 && (
                  <p className="page-empty-note">
                    Add some work to a page
                    before asking the tutor to
                    analyze it.
                  </p>
                )}
            </div>
          )}

          {loading && (
            <div className="ai-loading-card">
              <div className="ai-spinner" />

              <div>
                <strong>
                  STEMLens is thinking...
                </strong>

                <p>
                  Reviewing your selected
                  pages.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="ai-error-card">
              <strong>
                Something went wrong
              </strong>

              <p>{error}</p>
            </div>
          )}

          <div className="ai-actions">
            <button
              type="button"
              className="ai-action-btn"
              disabled={!canUseAI}
              onClick={handleGiveHint}
            >
              <div>
                <strong>Give Hint</strong>

                <span>
                  Get a nudge without revealing
                  the full solution.
                </span>
              </div>

              <span className="action-arrow">
                →
              </span>
            </button>

            <button
              type="button"
              className="ai-action-btn primary"
              disabled={!canUseAI}
              onClick={handleCheckWork}
            >
              <div>
                <strong>
                  Check My Work
                </strong>

                <span>
                  Review your reasoning and
                  identify the first mistake.
                </span>
              </div>

              <span className="action-arrow">
                →
              </span>
            </button>

            <button
              type="button"
              className="ai-action-btn"
              disabled={!canUseAI}
              onClick={handleTeach}
            >
              <div>
                <strong>Teach Me</strong>

                <span>
                  Learn the concept behind the
                  problem.
                </span>
              </div>

              <span className="action-arrow">
                →
              </span>
            </button>

            <button
              type="button"
              className="ai-action-btn danger-action"
              disabled={!canUseAI}
              onClick={handleShowSolution}
            >
              <div>
                <strong>
                  Show Solution
                </strong>

                <span>
                  Reveal a complete step-by-step
                  solution.
                </span>
              </div>

              <span className="action-arrow">
                →
              </span>
            </button>
          </div>
        </div>
      )}

      {mode === "hint" && (
        <div className="ai-response">
          <ResponseHeader
            type="Hint"
            title={
              hintResult?.title ||
              "Hint"
            }
            onBack={goHome}
          />

          {hintResult && (
            <>
              <div className="response-card hint-card">
                <div className="response-icon">
                  💡
                </div>

                <p>
                  {hintResult.hint}
                </p>
              </div>

              <div className="mini-example">
                <span>
                  Ask yourself
                </span>

                <strong>
                  What comes next?
                </strong>

                <p>
                  {
                    hintResult.nextQuestion
                  }
                </p>
              </div>

              <div className="response-actions">
                <button
                  type="button"
                  className="secondary-ai-btn"
                  onClick={
                    handleGiveHint
                  }
                  disabled={loading}
                >
                  Another Hint
                </button>

                <button
                  type="button"
                  className="primary-ai-btn"
                  onClick={
                    handleCheckWork
                  }
                  disabled={loading}
                >
                  Check My Work
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {mode === "check" && (
        <div className="ai-response">
          <ResponseHeader
            type="Work Check"
            title={
              checkResult?.pages.some(
                (page) =>
                  page.firstError !== null
              )
                ? "Found an issue"
                : "Your work looks good"
            }
            onBack={goHome}
          />

          {success && (
            <div className="ai-success-card">
              <span>✓</span>

              <p>{success}</p>
            </div>
          )}

          {checkResult && (
            <>
              <div className="check-summary">
                <div className="summary-stat">
                  <strong>
                    {
                      checkResult.pages
                        .length
                    }
                  </strong>

                  <span>
                    Pages checked
                  </span>
                </div>

                <div className="summary-stat">
                  <strong>
                    {checkResult.pages.reduce(
                      (total, page) =>
                        total +
                        page.steps.filter(
                          (step) =>
                            !step.correct
                        ).length,
                      0
                    )}
                  </strong>

                  <span>
                    Issues found
                  </span>
                </div>
              </div>

              {checkResult.pages.map(
                (pageResult) => (
                  <div
                    className="page-feedback-group"
                    key={
                      pageResult.pageId
                    }
                  >
                    <div className="page-feedback-header">
                      <span>
                        {
                          pageResult.pageName
                        }
                      </span>

                      <strong>
                        {pageResult.firstError ===
                        null
                          ? "Looks good"
                          : "Review needed"}
                      </strong>
                    </div>

                    <div className="step-list">
                      {pageResult.steps.map(
                        (step) => (
                          <div
                            key={`${pageResult.pageId}-${step.stepNumber}`}
                            className={
                              step.correct
                                ? "step-card correct-step"
                                : "step-card error-step"
                            }
                          >
                            <div className="step-status">
                              {step.correct
                                ? "✓"
                                : "!"}
                            </div>

                            <div className="step-content">
                              <span className="step-label">
                                Step{" "}
                                {
                                  step.stepNumber
                                }
                              </span>

                              <strong>
                                {step.correct
                                  ? "Correct"
                                  : step.mistakeType ||
                                    "Incorrect"}
                              </strong>

                              <p className="step-expression">
                                {step.text}
                              </p>

                              <p className="step-explanation">
                                {
                                  step.explanation
                                }
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    {pageResult.firstError !==
                      null &&
                      pageResult.steps
                        .filter(
                          (step) =>
                            step.stepNumber ===
                            pageResult.firstError
                        )
                        .map((step) => (
                          <div
                            className="mistake-card"
                            key={`mistake-${pageResult.pageId}`}
                          >
                            <span className="mistake-label">
                              First mistake on{" "}
                              {
                                pageResult.pageName
                              }
                            </span>

                            <strong>
                              {
                                step.explanation
                              }
                            </strong>

                            {step.hint && (
                              <p className="mistake-hint">
                                Hint:{" "}
                                {step.hint}
                              </p>
                            )}

                            <div className="mistake-actions">
                              <button
                                type="button"
                                className="secondary-ai-btn"
                                onClick={
                                  handleGiveHint
                                }
                                disabled={
                                  loading
                                }
                              >
                                Give Hint
                              </button>

                              <button
                                type="button"
                                className="secondary-ai-btn"
                                onClick={
                                  handleTeach
                                }
                                disabled={
                                  loading
                                }
                              >
                                Explain Mistake
                              </button>
                            </div>
                          </div>
                        ))}
                  </div>
                )
              )}

              <button
                type="button"
                className="primary-ai-btn full-width"
                onClick={handleCheckWork}
                disabled={loading}
              >
                {loading
                  ? "Checking..."
                  : "Check Again"}
              </button>
            </>
          )}
        </div>
      )}

      {mode === "teach" && (
        <div className="ai-response">
          <ResponseHeader
            type="Teach Me"
            title={
              teachResult?.concept ||
              "Concept Explanation"
            }
            onBack={goHome}
          />

          {teachResult && (
            <>
              <div className="response-card">
                <p>
                  {
                    teachResult.summary
                  }
                </p>
              </div>

              {teachResult.lessons.map(
                (lesson, index) => (
                  <div
                    className="lesson-card"
                    key={lesson.title}
                  >
                    <span className="lesson-number">
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </span>

                    <div>
                      <strong>
                        {lesson.title}
                      </strong>

                      <p>
                        {
                          lesson.explanation
                        }
                      </p>
                    </div>
                  </div>
                )
              )}

              {teachResult.formula && (
                <div className="formula-card">
                  <span>
                    Useful relationship
                  </span>

                  <strong>
                    {
                      teachResult.formula
                    }
                  </strong>
                </div>
              )}

              <div className="response-actions">
                <button
                  type="button"
                  className="secondary-ai-btn"
                  onClick={handleGiveHint}
                  disabled={loading}
                >
                  Give Hint
                </button>

                <button
                  type="button"
                  className="primary-ai-btn"
                  onClick={handleCheckWork}
                  disabled={loading}
                >
                  Check My Work
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {mode === "solution" && (
        <div className="ai-response">
          <ResponseHeader
            type="Full Solution"
            title="Step-by-step solution"
            onBack={goHome}
            danger
          />

          {solutionResult && (
            <>
              <div className="solution-warning">
                <strong>
                  Try solving it yourself first
                </strong>

                <p>
                  Full solutions are most useful
                  after you have attempted the
                  problem.
                </p>
              </div>

              <div className="response-card">
                <p>
                  {
                    solutionResult.summary
                  }
                </p>
              </div>

              <div className="solution-steps">
                {solutionResult.steps.map(
                  (step) => (
                    <div
                      className="solution-step"
                      key={
                        step.stepNumber
                      }
                    >
                      <span>
                        {
                          step.stepNumber
                        }
                      </span>

                      <div>
                        <p>
                          {
                            step.explanation
                          }
                        </p>

                        <strong>
                          {
                            step.expression
                          }
                        </strong>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="formula-card">
                <span>
                  Final answer
                </span>

                <strong>
                  {
                    solutionResult.finalAnswer
                  }
                </strong>
              </div>

              <button
                type="button"
                className="secondary-ai-btn full-width"
                onClick={goHome}
              >
                Back to Tutor
              </button>
            </>
          )}
        </div>
      )}
    </aside>
  );
}

type ResponseHeaderProps = {
  type: string;
  title: string;
  onBack: () => void;
  danger?: boolean;
};

function ResponseHeader({
  type,
  title,
  onBack,
  danger = false,
}: ResponseHeaderProps) {
  return (
    <div className="response-header">
      <button
        type="button"
        className="back-btn"
        onClick={onBack}
      >
        ←
      </button>

      <div>
        <span
          className={
            danger
              ? "response-type solution-type"
              : "response-type"
          }
        >
          {type}
        </span>

        <h3>{title}</h3>
      </div>
    </div>
  );
}

export default AITutor;