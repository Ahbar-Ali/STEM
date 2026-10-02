import './App.css'

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
        <section className="problem-section">
          <p className="label">Problem</p>
          <h2>Find the integral:</h2>
          <div className="equation">∫ x · e^(x²) dx</div>
        </section>

        <section className="work-section">
          <div className="work-header">
            <h2>Your Work</h2>
            <span>Not checked</span>
          </div>

         <textarea
          placeholder="Write your solution here..."
          className="work-input"
        />

          <div className="toolbar">
            <button>Pen</button>
            <button>Eraser</button>
            <button>Equation</button>
            <button>Undo</button>
            <button>Redo</button>
          </div>
        </section>
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
