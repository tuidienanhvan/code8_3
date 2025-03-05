import { createContext, useContext, useState } from "react";

// Tạo Context
const LoveContext = createContext({ love: 0, setLove: () => {} });

// Hook tùy chỉnh để dùng love dễ dàng
export const useLove = () => useContext(LoveContext);

export const LoveProvider = ({ children }) => {
  const [love, setLove] = useState(0);

  // Hàm tăng tình yêu nhưng không vượt quá 1
  const increaseLove = () => setLove((prev) => Math.min(prev + 0.1, 1));

  return (
    <LoveContext.Provider value={{ love, setLove: increaseLove }}>
      {children}
    </LoveContext.Provider>
  );
};

export default LoveProvider;
