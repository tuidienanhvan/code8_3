import React, { useEffect, useState, useRef, memo, useMemo } from "react";
import { nanoid } from "nanoid";
import "./Heart.css";

const PATH_LENGTH = 1506;
const LAYERS = 20;
const LAYER_GAP = 4;

const clamp = (min, max, n) => Math.min(max, Math.max(min, n));

const useDocumentEvent = (event, handler) => {
  useEffect(() => {
    const events = event.split(' ');
    events.forEach(event => document.addEventListener(event, handler));
    return () => events.forEach(event => document.removeEventListener(event, handler));
  }, [handler]);
};

const usePerishable = () => {
  const [items, setItems] = useState([]);
  const timeouts = useRef({});

  useEffect(() => {
    return () => Object.values(timeouts.current).forEach(clearTimeout);
  }, []);

  return {
    items,
    add: (delay, data) => {
      const id = nanoid();
      setItems(arr => [...arr, { id, data }]);
      timeouts.current[id] = setTimeout(() => {
        setItems(ids => ids.filter(item => item.id !== id));
        delete timeouts.current[id];
      }, delay);
    }
  };
};

const useCursorTilt = ({ref, tilt, bounds}) => {
  const [rotate, setRotate] = useState([-25, 25]);
  useDocumentEvent('mousemove', e => {
    requestAnimationFrame(() => {
      const {left, top, width, height} = ref.current.getBoundingClientRect();
      const [x, y] = [e.clientX, e.clientY];
      const rect = bounds 
        ? {top: top - bounds, left: left - bounds, width: width + bounds * 2, height: height + bounds * 2}
        : {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};

      setRotate([
        (-(clamp(0, rect.height, y - rect.top) - (rect.height/2)) / rect.height) * tilt,
        ((clamp(0, rect.width, x - rect.left) - (rect.width/2)) / rect.width) * tilt,
      ]);
    });
  });
  return rotate;
};

const Splash = memo(({circles}) => (
  <svg viewBox="0 0 500 430" className="splash">
    {circles.map(({id}) => (
      <HeartPath key={id}/>
    ))}
  </svg>
));

const HeartPath = () => (
  <path d="M500 143.64C500 286.45 321.49 322.15 250.08 429.26C178.68 322.15 0.17 286.45 0.17 143.64C0.17 72.24 53.72 0.83 142.98 0.83C214.38 0.83 250.08 72.24 250.08 72.24C250.08 72.24 285.79 0.83 357.19 0.83C446.45 0.83 500 72.24 500 143.64Z"/>
);

const ShineSVG = ({x, opacity, rotate, translateZ}) => (
  <svg viewBox="0 0 500 430" style={{transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(${translateZ}px) scale(0.9)`}} className="heart-shine">
    <defs>
      <clipPath id="heart">
        <HeartPath/>
      </clipPath>
    </defs>
    <rect x={500 - x * 700} y="0" width="200" height="430" fill={`rgba(255,255,255,${opacity})`} clipPath="url(#heart)"/>
  </svg>
);

const HeartSVG = ({rotate: {x, y}, translateZ, strokeDashoffset, scale = 1, className}) => (
  <svg className={className} viewBox="0 0 500 430" style={{transform: `rotateX(${x}deg) rotateY(${y}deg) translateZ(${translateZ}px) scale(${scale})`, strokeDashoffset}}>
    <HeartPath/>
  </svg>
);

const HeartFragment = ({ layer, rotate, isStroke, isShine, strokeDashoffset, shineX, shineOpacity, syncWithLayer }) => {
  const ref = useRef(null);
  const clipId = useRef(nanoid()).current;

  const tx = useMemo(() => Math.random() * 2 - 1, []);
  const tz = useMemo(() => Math.random() * 2 - 1, []);
  const rotation = useMemo(() => Math.random() * 120 - 60, []);
  
  const distance = useMemo(() => (layer / LAYERS) * 45, [layer]);
  const scaleFactor = useMemo(() => 0.9 - layer * 0.03, [layer]);
  const initialZ = layer * LAYER_GAP;
  const delay = syncWithLayer !== undefined ? syncWithLayer * 0.15 : layer * 0.15;

  useEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty('--layer', layer);
    }
  }, [layer]);

  return (
    <svg 
      ref={ref}
      className={`heart-fragment ${isStroke ? 'heart-stroke' : ''} ${isShine ? 'heart-shine' : ''}`}
      viewBox="0 0 500 430" 
      style={{ 
        "--tx": tx,
        "--tz": tz,
        "--rotation": `${rotation}deg`,
        "--distance": `${distance}vh`,
        "--scale-factor": scaleFactor,
        "--initialZ": `${initialZ}px`,
        "--delay": `${delay}s`,
        "--rotateX": `${rotate[0]}deg`,
        "--rotateY": `${rotate[1]}deg`,
        transform: `rotateX(${rotate[0]}deg) rotateY(${rotate[1]}deg) translateZ(${initialZ}px)`,
        strokeDashoffset: isStroke ? strokeDashoffset : undefined
      }}
    >
      {isShine ? (
        <>
          <defs>
            <clipPath id={`heart-${clipId}`}>
              <HeartPath />
            </clipPath>
          </defs>
          <rect 
            x={500 - shineX * 700} 
            y="0" 
            width="200" 
            height="430" 
            fill={`rgba(255,255,255,${shineOpacity})`} 
            clipPath={`url(#heart-${clipId})`}
          />
        </>
      ) : (
        <HeartPath />
      )}
    </svg>
  );
};

const Heart = ({ love, setLove, onPrevLoveChange, triggerBreak, onBreakStatusChange, isBroken }) => {
  const ref = useRef();
  const innerWrapperRef = useRef();
  const [pressed, setPressed] = useState(false);
  const [prevLove, setPrevLove] = useState(love);
  const { items, add } = usePerishable();
  const [x, y] = useCursorTilt({ref, tilt: 50, bounds: 50});
  const offset = (Math.atan2(y, x) / Math.PI) * (PATH_LENGTH / 2) + PATH_LENGTH / 2;
  const shakeTimeout = useRef(null);
  const isShaking = useRef(false);
  const [shineX, setShineX] = useState(0.5);
  const [shineOpacity, setShineOpacity] = useState(0.5);
  
  // State cho hiệu ứng love = 1
  const [autoOffset, setAutoOffset] = useState(0);
  const [randomTilt, setRandomTilt] = useState([0, 0]);
  const [pulseScale, setPulseScale] = useState(1);

  useDocumentEvent("mouseup", () => {
    if (!pressed) return;
    setPressed(false);
  });

  const handleMouseDown = () => {
    if (isBroken) return;
    setPressed(true);
  
    const newLove = love + 0.1;
    const updatedLove = newLove > 1 ? 0 : newLove;
    const roundedLove = Number(updatedLove.toFixed(1));
  
    setLove(roundedLove);
    add(1000);
  };  

  // Hiệu ứng đặc biệt khi love = 1
  const isLoveFull = love === 1 && !isBroken;

  useEffect(() => {
    if (isLoveFull) {
      // Random tilt effect
      const tiltInterval = setInterval(() => {
        const newX = (Math.random() * 50) - 25;
        const newY = (Math.random() * 50) - 25;
        setRandomTilt([newX, newY]);
      }, 3000);
      
      // Pulse scale effect
      const pulseInterval = setInterval(() => {
        setPulseScale(1.05);
        setTimeout(() => setPulseScale(1), 500);
      }, 2000);
      
      // Auto offset for stroke effect - CHỈ KHI LOVE = 1
      const offsetInterval = setInterval(() => {
        setAutoOffset(prev => (prev + 20) % PATH_LENGTH);
      }, 100);

      const shineInterval = setInterval(() => {
        setShineX(Math.random());
        setShineOpacity(Math.random() * 0.5 + 0.3);
      }, 500); // 2 giây đổi 1 lần
      
      return () => {
        clearInterval(tiltInterval);
        clearInterval(pulseInterval);
        clearInterval(offsetInterval);
        clearInterval(shineInterval)
      };
    } else {
      // Reset các hiệu ứng khi love không bằng 1
      setRandomTilt([0, 0]);
      setPulseScale(1);
      setAutoOffset(0);
    }
  }, [isLoveFull]);

  useEffect(() => {
    // SỬA LỖI: Cập nhật màu sắc theo biến love
    const lightness = love === 0 ? -50 : love * 80 + 20;
    document.documentElement.style.setProperty("--lightness", `${lightness}%`);
    
    document.body.style.backgroundImage = love === 0 
      ? "radial-gradient(circle, #333, #000)" 
      : "radial-gradient(circle, #edc9db, #f391c3)";
    
    // SỬA LỖI: Cập nhật màu viền và màu nền chính xác
    document.documentElement.style.setProperty("--heart-stroke-color", love === 0 ? "#1a1a1a" : "rgba(255, 255, 255, 1)");
    document.documentElement.style.setProperty("--heart-stroke-dark", love === 0 ? "rgba(0, 0, 2 ,1)" : `hsl(334deg, ${lightness}%, 25%)`);
    document.documentElement.style.setProperty("--shadow-color", love === 0 ? "rgba(26, 26, 26, 0.6)" : "hsla(334, 40%, 50%, 0.4)");
  
    if (triggerBreak && !isShaking.current && !isBroken) {
      isShaking.current = true;
      
      const startShake = () => {
        document.body.classList.add("phase1-shake");
        
        shakeTimeout.current = setTimeout(() => {
          document.body.classList.remove("phase1-shake");
          document.body.classList.add("phase2-shake");
          
          shakeTimeout.current = setTimeout(() => {
            document.body.classList.remove("phase2-shake");
            document.body.classList.add("phase3-shake");
            
            shakeTimeout.current = setTimeout(() => {
              if (innerWrapperRef.current) {
                innerWrapperRef.current.style.transition = 'transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)';
                innerWrapperRef.current.style.transform = 'scale(1)';
              }
              
              shakeTimeout.current = setTimeout(() => {
                document.body.classList.remove("phase3-shake");
                onBreakStatusChange(true);
                isShaking.current = false;
              }, 500);
            }, 2000);
          }, 2000);
        }, 2000);
      };
      
      startShake();
    } else if (love > 0 && !triggerBreak) {
      onBreakStatusChange(false);
    }

    if (love !== prevLove) {
      onPrevLoveChange(prevLove);
      setPrevLove(love);
    }

    return () => {
      if (shakeTimeout.current) {
        clearTimeout(shakeTimeout.current);
      }
      document.body.classList.remove("phase1-shake", "phase2-shake", "phase3-shake");
      isShaking.current = false;
    };
  }, [love, prevLove, triggerBreak, onPrevLoveChange, onBreakStatusChange, isBroken]);

  // Xác định rotation và offset dựa trên trạng thái
  const currentRotate = isLoveFull ? randomTilt : [x, y];
  const currentOffset = isLoveFull ? autoOffset : offset;
  
  // Tính toán scale với hiệu ứng pulse chỉ khi love = 1
  const scaleValue = (0.8 + love * 0.5 - pressed * 0.1) * (isLoveFull ? pulseScale : 1);

  return (
    <button 
      className={`heart ${isBroken ? "broken" : ""} ${isLoveFull ? "love-full" : ""}`}
      onMouseDown={handleMouseDown} 
      ref={ref} 
      style={{
        "--scale": scaleValue,
        pointerEvents: isBroken ? 'none' : 'auto'
      }}
      disabled={isBroken}
      aria-hidden={isBroken}
    >
      <div className="inner-wrapper" ref={innerWrapperRef}>
        {isBroken ? (
          <>
            {[...Array(LAYERS)].map((_, layer) => (
              <HeartFragment key={layer} layer={layer} rotate={currentRotate} />
            ))}
            <HeartFragment 
              key="shine" 
              layer={LAYERS} 
              rotate={currentRotate} 
              isShine 
              shineX={isLoveFull ? Math.random() : y / 50 + 0.5} 
              shineOpacity={isLoveFull ? Math.random() * 0.5 + 0.3 : x / 200 + 0.5}
              syncWithLayer={LAYERS - 1}
            />
            <HeartFragment 
              key="stroke" 
              layer={LAYERS} 
              rotate={currentRotate} 
              isStroke 
              strokeDashoffset={currentOffset}
              syncWithLayer={LAYERS - 1}
            />
          </>
        ) : (
          <>
            <Splash circles={items}/>
            {[...new Array(LAYERS)].map((_, i) => (
              <HeartSVG 
                key={i} 
                className="heart-layer" 
                rotate={{x: currentRotate[0], y: currentRotate[1]}} 
                translateZ={i * LAYER_GAP} 
                scale={Math.sin((i / LAYERS)*Math.PI)/10 + 1}
              />
            ))}
            <ShineSVG 
              x={isLoveFull ? shineX : y / 50 + 0.5} 
              opacity={isLoveFull ? shineOpacity : x / 200 + 0.5} 
              rotate={{x: currentRotate[0], y: currentRotate[1]}} 
              translateZ={(LAYERS + 1) * LAYER_GAP}
            />
            <HeartSVG 
              className="heart-stroke" 
              rotate={{x: currentRotate[0], y: currentRotate[1]}} 
              translateZ={(LAYERS + 1) * LAYER_GAP} 
              strokeDashoffset={currentOffset} 
              scale={0.9}
            />
          </>
        )}
        
        {/* Hiệu ứng kim tuyến chỉ khi love = 1 */}
        {isLoveFull && (
          <div className="love-sparkles">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="sparkle-particle"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </button>
  );
};

export default Heart;