import { useRef, useEffect } from "react";
import useAnimation from "./useAnimation";

function Character({ src, action, monitor }) {
  const { frame, position } = useAnimation(action);
  const canvas = useRef(null);
  const style = {
    top: position.y + "px",
    left: position.x + "px",
    zIndex: Math.trunc((position.y || 0) / 50) + 100
  }

  useEffect(() => {
    if(src && frame){
      const cx = canvas.current.getContext("2d");
      const { x, y } = frame;
      cx.clearRect(0, 0, 96, 96);
      cx.drawImage(src, x * 96, y * 96, 96, 96, 0, 0, 96, 96);
    }
  }, [src, frame])

  useEffect(() => {
    monitor("character", position);
  }, [position, monitor])

  return <div className="character" style={style}>
    <canvas ref={canvas} width="96" height="96"/>
  </div>
}

export default Character;