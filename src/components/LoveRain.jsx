import React, { useEffect } from "react";
import "./LoveRain.css";

const LoveRain = ({ love }) => { // Nhận love từ props
  useEffect(() => {
    const createLoveDrop = () => {
      if (Math.random() > love) return; // Điều chỉnh số lượng theo love

      const loveDrop = document.createElement("div");
      loveDrop.classList.add("love-drop");

      loveDrop.innerText = "💖"; // Icon trái tim lung linh
      loveDrop.style.left = `${Math.random() * 100}vw`; // Ngẫu nhiên vị trí ngang
      loveDrop.style.animationDuration = `${Math.random() * 2 + 2}s`; // Ngẫu nhiên tốc độ rơi

      document.body.appendChild(loveDrop);

      // Xóa sau khi animation kết thúc
      setTimeout(() => {
        loveDrop.remove();
      }, 4000);
    };

    const interval = setInterval(createLoveDrop, 200); // Mỗi 200ms thử tạo một trái tim

    return () => clearInterval(interval);
  }, [love]); // Khi love thay đổi, animation sẽ cập nhật

  return null;
};

export default LoveRain;
