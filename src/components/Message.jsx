import React, { useEffect, useState, useRef } from "react";
import "./Message.css";

const Message = ({ love, prevLove, onNoClick, isBroken }) => {
  const [displayMessage, setDisplayMessage] = useState("");
  const [fullMessage, setFullMessage] = useState("");
  const [isExiting, setIsExiting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [isYesClicked, setIsYesClicked] = useState(false);
  const [initialMessageDone, setInitialMessageDone] = useState(false);
  const [buttonsExiting, setButtonsExiting] = useState(false);
  const [showFinalProposal, setShowFinalProposal] = useState(false);
  const actionRef = useRef(null);

  const getMessage = () => {
    if (isBroken) return "Thật hả... Tổn thương sâu sắc T^T";
    if (love === 0 && !initialMessageDone) return "Chào cô bé, em có yêu anh hong?";
    if (love === 0 && isYesClicked) return "Vậy hãy ấn vào trái tim dưới đây";
    if (love <= 0.1) return "Uầy anh vẫn chưa cảm nhận được...";
    if (love <= 0.2) return "Hong ngờ mình nói chuyện được lâu vậy luôn...";
    if (love <= 0.3) return "Ấn tượng đầu tiên về em là lễ phép đáng iu...";
    if (love <= 0.4) return "Mà càng ngày càng bướng bỉnh, khó ưa =))";
    if (love <= 0.5) return "Dù vậy tình cảm của anh càng ngày càng lớn dần...";
    if (love <= 0.6) return "Một cô bé luôn lấy nụ cười che đi nỗi buồn của mình...";
    if (love <= 0.7) return "Thì siêu anh hùng của em đến rồi đây <3";
    if (love <= 0.8) return "Từ nay về sau hong cho phép em khóc 1 mình nữa nha...";
    if (love <= 0.9) return "Giống như trái tim này, tình cảm của anh sẽ luôn lớn dần...";
    if (love <= 1) return "Nguyễn Thanh Trúc ơiiii <3";
    return "";
  };

  const getMessageClass = () => {
    if (fullMessage === "Thật hả... Tổn thương sâu sắc T^T") return "sad";
    if (fullMessage === "Nguyễn Thanh Trúc ơiiii <3") return "final-message";
    return "";
  };

  const handleYesClick = () => {
    actionRef.current = 'yes';
    setButtonsExiting(true);
  };

  const handleNoClick = () => {
    actionRef.current = 'no';
    setButtonsExiting(true);
  };

  useEffect(() => {
    const newMessage = getMessage();
  
    if (displayMessage !== newMessage) {
      if (displayMessage) {
        setIsExiting(true);
        setIsTyping(false);
        const exitTimeout = setTimeout(() => {
          setIsExiting(false);
          setDisplayMessage("");
          setFullMessage(newMessage);
        }, 300);
        return () => clearTimeout(exitTimeout);
      } else {
        setFullMessage(newMessage);
        setDisplayMessage("");
      }
    }
  }, [love, prevLove, isYesClicked, isBroken]);  
  
  useEffect(() => {
    if (fullMessage && !isExiting && !isTyping) {
      setIsTyping(true);
      let index = 0;
      setDisplayMessage("");
      const typingInterval = setInterval(() => {
        if (index < fullMessage.length) {
          setDisplayMessage(fullMessage.substring(0, index + 1));
          index++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          
          if (love === 0 && !initialMessageDone && fullMessage === "Chào cô bé, em có yêu anh hong?") {
            setShowButtons(true);
            setInitialMessageDone(true);
          }
        }
      }, 50);

      return () => {
        clearInterval(typingInterval);
        setIsTyping(false);
      };
    }
  }, [fullMessage, isExiting]);

  useEffect(() => {
    if (buttonsExiting) {
      const timer = setTimeout(() => {
        if (actionRef.current === 'yes') {
          setIsYesClicked(true);
        } else if (actionRef.current === 'no') {
          onNoClick();
        }
        setShowButtons(false);
        setButtonsExiting(false);
        actionRef.current = null;
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [buttonsExiting, onNoClick]);

  useEffect(() => {
    if (love === 1 && !isTyping && fullMessage === "Nguyễn Thanh Trúc ơiiii <3") {
      const timer = setTimeout(() => {
        setShowFinalProposal(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setShowFinalProposal(false);
    }
  }, [love, isTyping, fullMessage]);

  return (
    <div className="message">
      <div className={`message-content ${isExiting ? "content-exit" : ""}`}>
        <span className={`message-text ${getMessageClass()}`}>
          {displayMessage}
        </span>
      </div>
      {showFinalProposal && (
        <div className="final-proposal">
          {"Làm bạn gái anh nha!!!".split('').map((char, index) => (
            <span 
              key={index} 
              className="char" 
              style={{ '--char-index': index }}
            >
              {char}
            </span>
          ))}
        </div>
      )}
      {love === 0 && (showButtons || buttonsExiting) && !isYesClicked && !isTyping && !isBroken && (
        <div className={`message-buttons ${showButtons && !buttonsExiting ? "buttons-entering" : ""} ${buttonsExiting ? "buttons-exiting" : ""}`}>
          <button className="message-button yes" onClick={handleYesClick}>
            Có
          </button>
          <button className="message-button no" onClick={handleNoClick}>
            Không
          </button>
        </div>
      )}
    </div>
  );
};

export default Message;