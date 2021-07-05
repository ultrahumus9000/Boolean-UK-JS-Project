export default function Aside({ mode, setMode }) {
  return (
    <aside>
      <button
        className={`mode ${mode}`}
        onClick={() => {
          mode === "Light" ? setMode("Dark") : setMode("Light");
        }}
      >
        {`Current Mode: ${mode}`}
      </button>
      <div className="information-board">
        <p>Score</p>
        <p>Score</p>
        <p>Level</p>
        <p>Level</p>
        <p>Next</p>
        <p>Next</p>
      </div>
      <div className="panel">
        <button>Next Level</button>
        <button>Pause</button>
        <button>Restart</button>
      </div>
    </aside>
  );
}
