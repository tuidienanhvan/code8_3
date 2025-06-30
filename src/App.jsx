import React, { useState, useEffect, useRef } from "react";
import Heart from "./components/Heart";
import LoveRain from "./components/LoveRain";
import Message from "./components/Message";
import Lyrics from "./components/Lyrics";
import "./App.css";

const App = () => {
  const [love, setLove] = useState(0);
  const [prevLove, setPrevLove] = useState(0);
  const [triggerBreak, setTriggerBreak] = useState(false);
  const [isBroken, setIsBroken] = useState(false);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const backgroundMusic = useRef(null);

  useEffect(() => {
    backgroundMusic.current = new Audio("/sounds/background.mp3");
    backgroundMusic.current.volume = 0.5;

    return () => {
      if (backgroundMusic.current) {
        backgroundMusic.current.pause();
        backgroundMusic.current = null;
      }
    };
  }, []);

  const handleLoveChange = (newLove) => {
    setLove(newLove);

    if (newLove === 1.0 && !hasPlayedAudio) {
      backgroundMusic.current
        .play()
        .then(() => setHasPlayedAudio(true))
        .catch((error) => console.error("Audio playback failed:", error));
    } else if (newLove < 1.0) {
      setHasPlayedAudio(false);
      backgroundMusic.current.pause();
      backgroundMusic.current.currentTime = 0;
    }
  };

  return (
    <div className="app">
      <Message
        love={love}
        prevLove={prevLove}
        onNoClick={() => setTriggerBreak(true)}
        isBroken={isBroken}
      />
      <LoveRain love={love} />
      <Heart
        love={love}
        setLove={handleLoveChange}
        onPrevLoveChange={setPrevLove}
        triggerBreak={triggerBreak}
        onBreakStatusChange={setIsBroken}
        isBroken={isBroken}
      />
      {love === 1.0 && (
        <Lyrics audioRef={backgroundMusic} isPlaying={true} />
      )}
    </div>
  );
};

export default App;
