import { useState } from "react";
import styled from "styled-components";
import Aside from "./components/Aside";
import Board from "./components/Board";
function App() {
  const [mode, setMode] = useState("Light");

  return (
    <div className="App">
      <Aside mode={mode} setMode={setMode} />
      <Board />
    </div>
  );
}

export default App;
