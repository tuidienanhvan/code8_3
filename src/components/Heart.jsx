import React, { useEffect, useState, useRef, memo } from "react";
import { nanoid } from "nanoid";
import "./Heart.css"; // Import file CSS để tạo hiệu ứng

const PATH_LENGTH = 1506;
const LAYERS = 20;
const LAYER_GAP = 4; // In pixels

const clamp = (min, max, n) => (
  Math.min(max, Math.max(min, n))
);

const useDocumentEvent = (event, handler) => {
  useEffect(() => {
    const events = event.split(' ');
    events.forEach(event => document.addEventListener(event, handler));
    return () => events.forEach(event => document.removeEventListener(event, handler));
  }, []);
};

// Read more about this hook here: https://yoavik.com/snippets/use-perishable
const usePerishable = () => {
    const [items, setItems] = useState([]);
    const timeouts = useRef({});

    useEffect(() => {
        // Cleanup pending timeouts when the component unmounts
        return () => Object.values(timeouts.current).forEach(clearTimeout);
    }, []);

    return {items, add: (delay, data) => {
        // Generate a unique ID
        const id = nanoid();
        // Create a new item with the given id & data
        setItems(arr => [...arr, { id, data }]);
        // Create a timeout to remove the item after the given delay
        timeouts.current[id] = setTimeout(() => {
            setItems(ids => ids.filter(item => item.id !== id));
            delete timeouts.current[id];
        }, delay);
    }};
};

const useCursorTilt = ({ref, tilt, bounds}) => {
  const [rotate, setRotate] = useState([-25,25]);
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
  })
  return rotate;
};

const Splash = memo(({circles}) => {
  return (
    <svg viewBox='0 0 500 430' className='splash'>
      {circles.map(({id}) => (
        <HeartPath key={id}/>
      ))}
    </svg>
  );
});

const HeartPath = () => (
  <path d="M500 143.64C500 286.45 321.49 322.15 250.08 429.26C178.68 322.15 0.17 286.45 0.17 143.64C0.17 72.24 53.72 0.83 142.98 0.83C214.38 0.83 250.08 72.24 250.08 72.24C250.08 72.24 285.79 0.83 357.19 0.83C446.45 0.83 500 72.24 500 143.64Z"/>
);

const ShineSVG = ({x, opacity, rotate, translateZ}) => (
  <svg viewBox="0 0 500 430" style={{transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(${translateZ}px) scale(0.9)`}} className='heart-shine'>
    <defs>
      <clipPath id="heart">
        <HeartPath/>
      </clipPath>
    </defs>
    <rect x={500 - x * (700)} y='0' width='200' height='430' fill={`rgba(255,255,255,${opacity}`} clipPath='url(#heart)'/>
  </svg>
);

const HeartSVG = ({rotate: {x, y}, translateZ, strokeDashoffset, scale = 1, className}) => (
  <svg className={className} viewBox="0 0 500 430" style={{transform: `rotateX(${x}deg) rotateY(${y}deg) translateZ(${translateZ}px) scale(${scale})`, strokeDashoffset}}>
    <HeartPath/>
  </svg>
);

const Heart = ({ love, setLove }) => {
  const ref = useRef();
  const [pressed, setPressed] = useState(false);
  const { items, add } = usePerishable();
  const [x,y] = useCursorTilt({ref, tilt: 50, bounds: 50});
  const offset = (Math.atan2(y, x) / Math.PI) * (PATH_LENGTH / 2) + PATH_LENGTH / 2;

  useDocumentEvent("mouseup", () => {
    if (!pressed) return; 
    setPressed(false);
  });

  const handleMouseDown = () => {
    setPressed(true);
    setLove((prevLove) => {
      const newLove = prevLove + 0.1;
      return newLove > 1 ? 0 : newLove;
    });
    add(1000);
  };

  
  useEffect(() => {
    console.log("love:", love);
    console.log("lightness:", love * 80 + 20);
    console.log("scale:", 0.8 + love * 0.2 - pressed * 0.1);
  }, [love]); // Chạy khi love thay đổi

  return (
    <button className='heart'  onMouseDown={handleMouseDown} ref={ref} style={{'--lightness': `${love * 80 + 20}%`, '--scale': 0.8 + love * 0.5 - pressed * 0.1}}>
      <div className='inner-wrapper'>
        <Splash circles={items}/>
        {[... new Array(LAYERS)].map((_, i) => (
          <HeartSVG key={i} className='heart-layer' rotate={{x, y}} translateZ={i * LAYER_GAP} scale={Math.sin((i / LAYERS)*Math.PI)/10 + 1}/>
        ))}
        <HeartSVG className='heart-stroke' rotate={{x, y}} translateZ={(LAYERS + 1) * LAYER_GAP} strokeDashoffset={offset} scale={0.9}/>
        <ShineSVG x={y / 50 + 0.5} opacity={x / 200 + 0.5} rotate={{x, y}} translateZ={(LAYERS + 1) * LAYER_GAP}/>
        
      </div>
    </button>
  );
};

export default Heart;
