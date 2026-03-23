import React from "react";
import TurkeyMap from "./components/TurkeyMap";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #e8edf5 0%, #f0f4fa 50%, #e4eaf4 100%)",
      }}
    >
      <TurkeyMap />
    </div>
  );
}

export default App;