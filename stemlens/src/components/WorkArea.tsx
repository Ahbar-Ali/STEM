
import { useEffect, useRef, useState } from "react";
import "../styles/WorkArea.css";
import type { WorkspacePageData } from "../types/ai.Tutor";

type Mode = "type" | "write";
type Tool = "pen" | "eraser" | "highlighter";

type Point = {
  x: number;
  y: number;
};

type Snapshot = ImageData;

type WorkspacePage = {
  id: string;
  name: string;
};

type WorkAreaProps = {
  onWorkChange: (work: string) => void;
  onPagesChange: (pages: WorkspacePageData[]) => void;
  onActivePageChange: (pageId: string) => void;
};

function WorkArea({
  onWorkChange,
  onPagesChange,
  onActivePageChange,
}: WorkAreaProps) {
  const [mode, setMode] = useState<Mode>(() => {
    return localStorage.getItem("stemlens-mode") === "write"
      ? "write"
      : "type";
  });

  const [typedWorkByPage, setTypedWorkByPage] = useState<
    Record<string, string>
  >(() => {
    try {
      const saved = localStorage.getItem("stemlens-typed-work-pages");
      return saved ? JSON.parse(saved) : { "page-1": "" };
    } catch {
      return { "page-1": "" };
    }
  });

  const [pages, setPages] = useState<WorkspacePage[]>(() => {
    try {
      const saved = localStorage.getItem("stemlens-pages");
      return saved
        ? JSON.parse(saved)
        : [{ id: "page-1", name: "Page 1" }];
    } catch {
      return [{ id: "page-1", name: "Page 1" }];
    }
  });

  const [activePageId, setActivePageId] = useState(() => {
    return localStorage.getItem("stemlens-active-page") || "page-1";
  });

  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#ffffff");
  const [lineWidth, setLineWidth] = useState(3);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);

  const undoStackRef = useRef<Snapshot[]>([]);
  const redoStackRef = useRef<Snapshot[]>([]);

  // Keep AI-ready images separate from editable canvas images.
  const [canvasImagesByPage, setCanvasImagesByPage] = useState<
    Record<string, string>
  >(() => {
    const images: Record<string, string> = {};

    for (const page of pages) {
      const saved = localStorage.getItem(
        `stemlens-ai-canvas-${page.id}`
      );

      if (saved) {
        images[page.id] = saved;
      }
    }

    return images;
  });

  // Set up and restore the drawing canvas.
  useEffect(() => {
    if (mode !== "write") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;

    const setupCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;

      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    const restoreImage = (dataUrl: string) => {
      const image = new Image();

      image.onload = () => {
        if (cancelled) return;

        const rect = canvas.getBoundingClientRect();

        ctx.save();
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";

        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.drawImage(image, 0, 0, rect.width, rect.height);

        ctx.restore();
      };

      image.src = dataUrl;
    };

    setupCanvasSize();

    const savedImage = localStorage.getItem(
      `stemlens-canvas-${activePageId}`
    );

    if (savedImage) {
      restoreImage(savedImage);
    }

    const handleResize = () => {
      const currentImage = canvas.toDataURL("image/png");

      setupCanvasSize();
      restoreImage(currentImage);

      undoStackRef.current = [];
      redoStackRef.current = [];
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResize);
    };
  }, [mode, activePageId]);

  // Save typed work.
  useEffect(() => {
    localStorage.setItem(
      "stemlens-typed-work-pages",
      JSON.stringify(typedWorkByPage)
    );
  }, [typedWorkByPage]);

  // Save active editor mode.
  useEffect(() => {
    localStorage.setItem("stemlens-mode", mode);
  }, [mode]);

  // Save workspace pages.
  useEffect(() => {
    localStorage.setItem("stemlens-pages", JSON.stringify(pages));
  }, [pages]);

  // Save active page.
  useEffect(() => {
    localStorage.setItem("stemlens-active-page", activePageId);
  }, [activePageId]);

  // Notify App.tsx when the active page changes.
  useEffect(() => {
    onActivePageChange(activePageId);
  }, [activePageId, onActivePageChange]);

  // Send typed work and drawing images to App.tsx.
  useEffect(() => {
    const pageData: WorkspacePageData[] = pages.map((page) => ({
      id: page.id,
      name: page.name,
      work: typedWorkByPage[page.id] || "",
      imageData: canvasImagesByPage[page.id] || undefined,
    }));

    onPagesChange(pageData);
  }, [
    pages,
    typedWorkByPage,
    canvasImagesByPage,
    onPagesChange,
  ]);

  const currentTypedWork = typedWorkByPage[activePageId] || "";

  useEffect(() => {
    onWorkChange(currentTypedWork);
  }, [currentTypedWork, onWorkChange]);

  const getPoint = (
    event: React.PointerEvent<HTMLCanvasElement>
  ): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  // Save canvas state for undo.
  const saveSnapshot = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const snapshot = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    undoStackRef.current.push(snapshot);

    if (undoStackRef.current.length > 50) {
      undoStackRef.current.shift();
    }

    redoStackRef.current = [];
  };

  const configureTool = (ctx: CanvasRenderingContext2D) => {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.globalAlpha = 1;
      ctx.lineWidth = lineWidth * 3;
      return;
    }

    ctx.globalCompositeOperation = "source-over";

    if (tool === "highlighter") {
      ctx.globalAlpha = 0.28;
      ctx.lineWidth = lineWidth * 4;
      ctx.strokeStyle = color;
      return;
    }

    ctx.globalAlpha = 1;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
  };

  const startDrawing = (
    event: React.PointerEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    saveSnapshot();
    configureTool(ctx);

    canvas.setPointerCapture(event.pointerId);

    isDrawingRef.current = true;
    lastPointRef.current = getPoint(event);
  };

  const draw = (
    event: React.PointerEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawingRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const point = getPoint(event);
    const lastPoint = lastPointRef.current;

    if (!point || !lastPoint) return;

    configureTool(ctx);

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    lastPointRef.current = point;
  };

  const stopDrawing = (
    event: React.PointerEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;

    if (canvas?.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }

    if (!isDrawingRef.current) return;

    isDrawingRef.current = false;
    lastPointRef.current = null;

    saveCanvas();
  };

  // Save editable drawing and AI-ready image.
  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const originalImage = canvas.toDataURL("image/png");

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;

    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#151a24";
    ctx.fillRect(
      0,
      0,
      exportCanvas.width,
      exportCanvas.height
    );

    ctx.drawImage(canvas, 0, 0);

    const aiImage = exportCanvas.toDataURL("image/png");

    try {
      localStorage.setItem(
        `stemlens-canvas-${activePageId}`,
        originalImage
      );

      localStorage.setItem(
        `stemlens-ai-canvas-${activePageId}`,
        aiImage
      );
    } catch (error) {
      console.warn("Could not save canvas to local storage.", error);
    }

    setCanvasImagesByPage((previous) => ({
      ...previous,
      [activePageId]: aiImage,
    }));
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    saveSnapshot();

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.restore();

    localStorage.removeItem(
      `stemlens-canvas-${activePageId}`
    );

    localStorage.removeItem(
      `stemlens-ai-canvas-${activePageId}`
    );

    setCanvasImagesByPage((previous) => {
      const updated = { ...previous };
      delete updated[activePageId];
      return updated;
    });
  };

  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;
    if (undoStackRef.current.length === 0) return;

    const current = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    redoStackRef.current.push(current);

    const previous = undoStackRef.current.pop();
    if (!previous) return;

    ctx.putImageData(previous, 0, 0);
    saveCanvas();
  };

  const redo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;
    if (redoStackRef.current.length === 0) return;

    const current = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    undoStackRef.current.push(current);

    const next = redoStackRef.current.pop();
    if (!next) return;

    ctx.putImageData(next, 0, 0);
    saveCanvas();
  };

  const addPage = () => {
    const pageNumber = pages.length + 1;

    const newPage: WorkspacePage = {
      id: `page-${Date.now()}`,
      name: `Page ${pageNumber}`,
    };

    setPages((previous) => [...previous, newPage]);

    setTypedWorkByPage((previous) => ({
      ...previous,
      [newPage.id]: "",
    }));

    setActivePageId(newPage.id);

    undoStackRef.current = [];
    redoStackRef.current = [];
  };

  const changePage = (pageId: string) => {
    if (pageId === activePageId) return;

    // Existing drawings are already saved after each stroke.
    setActivePageId(pageId);

    undoStackRef.current = [];
    redoStackRef.current = [];
  };

  return (
    <section className="work-section">
      <div className="work-header">
        <div>
          <h2>Your Work</h2>
          <p className="work-subtitle">
            Solve it yourself, then ask STEMLens for help when you want.
          </p>
        </div>
        <span>Not checked</span>
      </div>

      <div className="workspace-pages">
        <div className="page-tabs">
          {pages.map((page) => (
            <button
              key={page.id}
              type="button"
              className={
                page.id === activePageId
                  ? "page-tab active"
                  : "page-tab"
              }
              onClick={() => changePage(page.id)}
            >
              {page.name}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="add-page-btn"
          onClick={addPage}
        >
          + Add Page
        </button>
      </div>

      <div className="mode-switch">
        <button
          type="button"
          className={
            mode === "type"
              ? "mode-btn active"
              : "mode-btn"
          }
          onClick={() => setMode("type")}
        >
          Type
        </button>

        <button
          type="button"
          className={
            mode === "write"
              ? "mode-btn active"
              : "mode-btn"
          }
          onClick={() => setMode("write")}
        >
          Write
        </button>
      </div>

      {mode === "type" ? (
        <textarea
          value={currentTypedWork}
          onChange={(event) => {
            const newValue = event.target.value;

            setTypedWorkByPage((previous) => ({
              ...previous,
              [activePageId]: newValue,
            }));
          }}
          placeholder="Write your solution here..."
          className="work-input"
        />
      ) : (
        <>
          <div className="drawing-toolbar">
            <div className="tool-group">
              <button
                type="button"
                className={
                  tool === "pen"
                    ? "tool-btn active"
                    : "tool-btn"
                }
                onClick={() => setTool("pen")}
              >
                Pen
              </button>

              <button
                type="button"
                className={
                  tool === "highlighter"
                    ? "tool-btn active"
                    : "tool-btn"
                }
                onClick={() => setTool("highlighter")}
              >
                Highlighter
              </button>

              <button
                type="button"
                className={
                  tool === "eraser"
                    ? "tool-btn active"
                    : "tool-btn"
                }
                onClick={() => setTool("eraser")}
              >
                Eraser
              </button>
            </div>

            <div className="tool-divider" />

            <div className="tool-control">
              <span className="control-label">
                Thickness
              </span>

              <input
                type="range"
                min="1"
                max="12"
                value={lineWidth}
                onChange={(event) =>
                  setLineWidth(Number(event.target.value))
                }
              />

              <span className="thickness-value">
                {lineWidth}px
              </span>
            </div>

            <div className="tool-divider" />

            <div className="tool-control">
              <span className="control-label">
                Color
              </span>

              <input
                className="color-picker"
                type="color"
                value={color}
                onChange={(event) =>
                  setColor(event.target.value)
                }
              />
            </div>

            <div className="toolbar-spacer" />

            <div className="history-buttons">
              <button
                type="button"
                onClick={undo}
              >
                Undo
              </button>

              <button
                type="button"
                onClick={redo}
              >
                Redo
              </button>

              <button
                type="button"
                className="clear-btn"
                onClick={clearCanvas}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="canvas-wrapper">
            <canvas
              ref={canvasRef}
              className="work-canvas"
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerCancel={stopDrawing}
            />
          </div>
        </>
      )}
    </section>
  );
}

export default WorkArea;
