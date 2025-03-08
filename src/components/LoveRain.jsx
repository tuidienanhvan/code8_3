import React, { useEffect, useRef } from "react";
import "./LoveRain.css";

const MAX_HEARTS = 50; // Giới hạn tối đa 50 trái tim

const LoveRain = ({ love }) => {
  const containerRef = useRef(null); // Tham chiếu đến container

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Tạo pool 50 trái tim để tái sử dụng
    const heartPool = Array(MAX_HEARTS)
      .fill()
      .map(() => {
        const loveDrop = document.createElement("div");
        loveDrop.classList.add("love-drop");
        loveDrop.innerHTML = "💖";
        loveDrop.style.display = "none"; // Ẩn ban đầu
        container.appendChild(loveDrop);
        return loveDrop;
      });

    let activeHearts = []; // Danh sách các trái tim đang hoạt động

    const createLoveDrop = () => {
      if (activeHearts.length >= MAX_HEARTS || Math.random() > love) return;

      const loveDrop = heartPool.find((h) => h.style.display === "none");
      if (!loveDrop) return;

      loveDrop.style.left = `${Math.random() * 100}vw`;
      loveDrop.style.animationDuration = `${Math.random() * 2 + 2}s`;
      loveDrop.style.display = "block"; // Hiện trái tim

      activeHearts.push(loveDrop);

      setTimeout(() => {
        loveDrop.style.display = "none";
        activeHearts = activeHearts.filter((h) => h !== loveDrop);
      }, 4000);
    };

    const intervalId = window.setInterval(createLoveDrop, 200);

    return () => {
      window.clearInterval(intervalId);
      heartPool.forEach((heart) => {
        if (heart.parentNode) heart.remove();
      });
    };
  }, [love]);

  return <div id="love-rain-container" ref={containerRef}></div>;
};

export default LoveRain;