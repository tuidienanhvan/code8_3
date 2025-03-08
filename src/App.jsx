import React, { useState } from "react";
import Heart from "./components/Heart";
import LoveRain from "./components/LoveRain";
import Message from "./components/Message";
import "./App.css";

const App = () => {
  const [love, setLove] = useState(0);
  const [prevLove, setPrevLove] = useState(0); // Thêm state prevLove

  // Callback để Heart báo giá trị prevLove lên App
  const handlePrevLoveChange = (prev) => {
    setPrevLove(prev);
  };

  return (
    <div className="app">
      <Message love={love} prevLove={prevLove} /> {/* Truyền prevLove vào Message */}
      <LoveRain love={love} />
      <Heart setLove={setLove} love={love} onPrevLoveChange={handlePrevLoveChange} /> {/* Truyền callback */}
    </div>
  );
};

export default App;