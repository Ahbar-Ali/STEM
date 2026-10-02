import { useEffect, useState } from "react";

import "./styles/App.css";

import ProblemSection from "./components/problemSection";
import WorkArea from "./components/WorkArea";
import AITutor from "./components/AITutor";

function App() {
  const [currentProblem, setCurrentProblem] = useState(() => {
    return localStorage.getItem("stemlens-current-problem") || "";
  });

  const [currentWork, setCurrentWork] = useState(() => {
    return localStorage.getItem("stemlens-current-work") || "";
  });

  useEffect(() => {
    localStorage.setItem(
      "stemlens-current-problem",
      currentProblem
    );
  }, [currentProblem]);

  useEffect(() => {
    localStorage.setItem(
      "stemlens-current-work",
      currentWork
    );
  }, [currentWork]);

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>STEMLens</h1>

        <nav>
          <button>Dashboard</button>
          <button>New Problem</button>
          <button>My Workspace</button>
          <button>Evaluate Me</button>
          <button>Progress</button>
        </nav>
      </aside>

      <main className="workspace">
        <ProblemSection
          currentProblem={currentProblem}
          setCurrentProblem={setCurrentProblem}
        />

        <WorkArea
          onWorkChange={setCurrentWork}
        />
      </main>

      <AITutor
        problem={currentProblem}
        work={currentWork}
      />
    </div>
  );
}

export default App;