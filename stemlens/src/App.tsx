import "./styles/App.css";
import ProblemSection from "./components/problemSection";
import WorkArea from "./components/WorkArea";

function App() {
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
          <ProblemSection />
        <WorkArea />
      </main>

      <aside className="ai-panel">
        <p className="label">AI Tutor</p>

        <div className="concept-card">
          <span>Detected concept</span>
          <strong>Integration by substitution</strong>
        </div>

        <button>Give Hint</button>
        <button>Check My Work</button>
        <button>Teach Me</button>
        <button>Show Solution</button>
      </aside>
    </div>
  );
}

export default App;