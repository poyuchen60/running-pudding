import { useEffect, useRef } from "react";

function Scene({ scene, position, size }){
  const background = useRef();
  const style = {
    bottom: 0,
    left: Math.max(100 - position.x, size.width - scene.length)
  }
  useEffect(() => {
    const { frames, length, obstacles } = scene;
    const canvas = background.current;
    const ctx = canvas.getContext('2d');
    canvas.width = length;
    canvas.height = 500;
    frames.forEach((f) => {
      ctx.drawImage(f.src, f.offset, 0);
    })
    obstacles.forEach(({ x, y, width, height }) => {
      ctx.fillRect(x, 445 - y - height, width, height);
    })
  }, [scene]);
  return <div className="scene-container">
    <canvas ref={background} style={style} className="scene-background"/>
  </div>
}

export default Scene;