import React, { useState } from "react";
import Heart from "./components/Heart";
import LoveRain from "./components/LoveRain";

const App = () => {
  const [love, setLove] = useState(0);

  return (
    <div className="app">
      <LoveRain love={love} />
      <Heart setLove={setLove} love={love} />
    </div>
  );
};

export default App;
