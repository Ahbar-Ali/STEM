import {
  useEffect,
  useRef,
  useState,
} from "react";

import "../styles/problemSection.css";

import {
  mockExtractProblem,
} from "../services/mockVisionService";

import type {
  ProblemImage,
  ProblemInputMode,
} from "../types/problemInput";

type ProblemSectionProps = {
  currentProblem: string;

  setCurrentProblem: React.Dispatch<
    React.SetStateAction<string>
  >;
};

function ProblemSection({
  currentProblem,
  setCurrentProblem,
}: ProblemSectionProps) {
  const [problemInput, setProblemInput] =
    useState(currentProblem);

  const [isEditing, setIsEditing] =
    useState(!currentProblem);

  const [inputMode, setInputMode] =
    useState<ProblemInputMode>("text");

  const [problemImage, setProblemImage] =
    useState<ProblemImage | null>(null);

  const [extractedProblem, setExtractedProblem] =
    useState("");

  const [extracting, setExtracting] =
    useState(false);

  const [imageError, setImageError] =
    useState("");

  const uploadInputRef =
    useRef<HTMLInputElement | null>(null);

  const cameraInputRef =
    useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (problemImage?.previewUrl) {
        URL.revokeObjectURL(
          problemImage.previewUrl
        );
      }
    };
  }, [problemImage]);

  const handleStartProblem = () => {
    const cleanedProblem =
      problemInput.trim();

    if (!cleanedProblem) {
      return;
    }

    setCurrentProblem(cleanedProblem);

    setProblemInput(cleanedProblem);

    setIsEditing(false);
  };

  const handleEditProblem = () => {
    setProblemInput(currentProblem);

    setIsEditing(true);

    setInputMode("text");
  };

  const handleCancelEdit = () => {
    setProblemInput(currentProblem);

    setIsEditing(false);
  };

  const handleImageSelected = (
    file: File | undefined
  ) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImageError(
        "Please choose an image file."
      );

      return;
    }

    if (problemImage?.previewUrl) {
      URL.revokeObjectURL(
        problemImage.previewUrl
      );
    }

    const previewUrl =
      URL.createObjectURL(file);

    setProblemImage({
      file,
      previewUrl,
    });

    setExtractedProblem("");

    setImageError("");
  };

  const handleUploadChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleImageSelected(
      event.target.files?.[0]
    );

    event.target.value = "";
  };

  const handleCameraChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleImageSelected(
      event.target.files?.[0]
    );

    event.target.value = "";
  };

  const handleExtractProblem = async () => {
    if (!problemImage || extracting) {
      return;
    }

    setExtracting(true);

    setImageError("");

    try {
      const result =
        await mockExtractProblem(
          problemImage.file
        );

      setExtractedProblem(
        result.extractedText
      );
    } catch (error) {
      console.error(
        "Problem extraction failed:",
        error
      );

      setImageError(
        "STEMLens could not read this image. Please try another one."
      );
    } finally {
      setExtracting(false);
    }
  };

  const handleUseExtractedProblem = () => {
    const cleanedProblem =
      extractedProblem.trim();

    if (!cleanedProblem) {
      return;
    }

    setProblemInput(cleanedProblem);

    setCurrentProblem(cleanedProblem);

    setIsEditing(false);

    setInputMode("text");
  };

  const handleRemoveImage = () => {
    if (problemImage?.previewUrl) {
      URL.revokeObjectURL(
        problemImage.previewUrl
      );
    }

    setProblemImage(null);

    setExtractedProblem("");

    setImageError("");

    if (uploadInputRef.current) {
      uploadInputRef.current.value = "";
    }

    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
  };

  return (
    <section className="problem-section">
      {!isEditing && currentProblem ? (
        <div className="current-problem-card">
          <div className="current-problem-header">
            <div>
              <span className="problem-label">
                Current Problem
              </span>

              <h2>
                Your Problem
              </h2>
            </div>

            <button
              type="button"
              className="edit-problem-btn"
              onClick={
                handleEditProblem
              }
            >
              Edit Problem
            </button>
          </div>

          <p className="current-problem-text">
            {currentProblem}
          </p>
        </div>
      ) : (
        <div className="problem-entry">
          <div className="problem-entry-heading">
            <div>
              <span className="problem-label">
                New Problem
              </span>

              <h2>
                What are you working on?
              </h2>
            </div>

            <p>
              Type the problem or import it
              from an image.
            </p>
          </div>

          <div className="problem-input-tabs">
            <button
              type="button"
              className={
                inputMode === "text"
                  ? "problem-tab active"
                  : "problem-tab"
              }
              onClick={() =>
                setInputMode("text")
              }
            >
              Type Problem
            </button>

            <button
              type="button"
              className={
                inputMode === "image"
                  ? "problem-tab active"
                  : "problem-tab"
              }
              onClick={() =>
                setInputMode("image")
              }
            >
              Image / Camera
            </button>
          </div>

          {inputMode === "text" && (
            <div className="problem-text-mode">
              <textarea
                className="problem-input"
                value={problemInput}
                onChange={(event) =>
                  setProblemInput(
                    event.target.value
                  )
                }
                placeholder="Type or paste your STEM problem here..."
              />

              <div className="problem-entry-actions">
                {currentProblem && (
                  <button
                    type="button"
                    className="problem-secondary-btn"
                    onClick={
                      handleCancelEdit
                    }
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="button"
                  className="problem-primary-btn"
                  disabled={
                    !problemInput.trim()
                  }
                  onClick={
                    handleStartProblem
                  }
                >
                  Start Solving
                </button>
              </div>
            </div>
          )}

          {inputMode === "image" && (
            <div className="problem-image-mode">
              <input
                ref={uploadInputRef}
                className="hidden-file-input"
                type="file"
                accept="image/*"
                onChange={
                  handleUploadChange
                }
              />

              <input
                ref={cameraInputRef}
                className="hidden-file-input"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={
                  handleCameraChange
                }
              />

              {!problemImage && (
                <div className="problem-image-empty">
                  <div className="image-input-icon">
                    +
                  </div>

                  <h3>
                    Add a problem image
                  </h3>

                  <p>
                    Upload a screenshot,
                    textbook photo, handwritten
                    problem, or take a photo.
                  </p>

                  <div className="image-input-actions">
                    <button
                      type="button"
                      className="problem-primary-btn"
                      onClick={() =>
                        uploadInputRef.current?.click()
                      }
                    >
                      Upload Image
                    </button>

                    <button
                      type="button"
                      className="problem-secondary-btn"
                      onClick={() =>
                        cameraInputRef.current?.click()
                      }
                    >
                      Take Photo
                    </button>
                  </div>
                </div>
              )}

              {problemImage && (
                <>
                  <div className="problem-image-preview-card">
                    <div className="problem-image-preview-header">
                      <div>
                        <span>
                          Problem image
                        </span>

                        <strong>
                          {
                            problemImage.file
                              .name
                          }
                        </strong>
                      </div>

                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={
                          handleRemoveImage
                        }
                      >
                        Remove
                      </button>
                    </div>

                    <div className="problem-image-preview">
                      <img
                        src={
                          problemImage.previewUrl
                        }
                        alt="Selected STEM problem"
                      />
                    </div>

                    <div className="image-preview-actions">
                      <button
                        type="button"
                        className="problem-secondary-btn"
                        onClick={() =>
                          uploadInputRef.current?.click()
                        }
                      >
                        Replace
                      </button>

                      <button
                        type="button"
                        className="problem-primary-btn"
                        disabled={extracting}
                        onClick={
                          handleExtractProblem
                        }
                      >
                        {extracting
                          ? "Reading Problem..."
                          : "Extract Problem"}
                      </button>
                    </div>
                  </div>

                  {extracting && (
                    <div className="problem-extracting-card">
                      <div className="problem-spinner" />

                      <div>
                        <strong>
                          Reading your image...
                        </strong>

                        <p>
                          Detecting text and
                          mathematical expressions.
                        </p>
                      </div>
                    </div>
                  )}

                  {extractedProblem && (
                    <div className="extracted-problem-card">
                      <div className="extracted-problem-heading">
                        <div>
                          <span>
                            Extracted Problem
                          </span>

                          <strong>
                            Review before continuing
                          </strong>
                        </div>

                        <span className="mock-badge">
                          Mock OCR
                        </span>
                      </div>

                      <textarea
                        className="extracted-problem-input"
                        value={
                          extractedProblem
                        }
                        onChange={(event) =>
                          setExtractedProblem(
                            event.target.value
                          )
                        }
                      />

                      <p className="extracted-problem-note">
                        Correct anything STEMLens
                        misread before starting
                        the problem.
                      </p>

                      <button
                        type="button"
                        className="problem-primary-btn full-problem-width"
                        disabled={
                          !extractedProblem.trim()
                        }
                        onClick={
                          handleUseExtractedProblem
                        }
                      >
                        Use This Problem
                      </button>
                    </div>
                  )}
                </>
              )}

              {imageError && (
                <div className="problem-image-error">
                  <strong>
                    Couldn&apos;t use this image
                  </strong>

                  <p>
                    {imageError}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default ProblemSection;