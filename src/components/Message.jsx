import React, { useEffect, useState } from "react";
import "./Message.css";

const Message = ({ love, prevLove }) => {
  const [displayMessage, setDisplayMessage] = useState("");
  const [fullMessage, setFullMessage] = useState("");
  const [isExiting, setIsExiting] = useState(false);

  const getMessage = () => {
    if (love === 0 && prevLove > 0) return "Trái tim tan vỡ, mọi thứ hoá hư vô...";
    if (love === 0) return "Ở đây có một trái tim lạnh lẽo, hãy nhấp vào nó...";
    if (love <= 0.1) return "Cảm ơn cậu nhưng như thế vẫn chưa đủ...";
    if (love <= 0.2) return "Từ ngày biết cậu, trái tim tớ khẽ rung động...";
    if (love <= 0.3) return "Càng nói chuyện tớ muốn càng hiểu cậu hơn...";
    if (love <= 0.4) return "Cậu thật xinh đẹp đó...";
    if (love <= 0.5) return "Nửa hành trình đã qua, tình cảm của tớ đang lớn dần...";
    if (love <= 0.6) return "Tớ không muốn mất cậu...";
    if (love <= 0.7) return "Tớ bắt đầu nhận ra tớ thích cậu rồi...";
    if (love <= 0.8) return "Mỗi ngày đều nhớ về cậu...";
    if (love <= 0.9) return "Chỉ còn một bước cuối cùng nữa là...";
    if (love <= 1) return "Chúc cậu ngày 8/3 vui vẻ và tràn ngập hạnh phúc!";
    return ""; 
  };

  useEffect(() => {
    if (displayMessage) {
      setIsExiting(true);
      const exitTimeout = setTimeout(() => {
        setIsExiting(false);
        setDisplayMessage("");
        setFullMessage(getMessage());
      }, 300);
      return () => clearTimeout(exitTimeout);
    } else {
      setFullMessage(getMessage());
    }
  }, [love, prevLove]);

  useEffect(() => {
    if (fullMessage && !isExiting) {
      let index = 0;
      setDisplayMessage(""); // Reset trước khi type
      const typingInterval = setInterval(() => {
        if (index < fullMessage.length) {
          setDisplayMessage(fullMessage.substring(0, index + 1)); // Lấy chuỗi từ đầu đến index
          index++;
        } else {
          clearInterval(typingInterval); // Dừng khi type xong
        }
      }, 50); // 50ms mỗi ký tự

      return () => clearInterval(typingInterval);
    }
  }, [fullMessage, isExiting]);

  return (
    <div
      key={love + "_" + prevLove}
      className={`message ${isExiting ? "message-exit" : ""}`}
    >
      {displayMessage}
    </div>
  );
};

export default Message;