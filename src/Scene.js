import { useEffect, useRef } from "react";

function Scene({ scene }){
  const background = useRef();
  const style = {
    left: scene.x
  }
  useEffect(() => {
    const canvas = background.current;
    const ctx = canvas.getContext('2d');
    canvas.width = scene.length;
    canvas.height = 500;
    scene.frames.forEach((f) => {
      ctx.drawImage(f.src, f.offset, 0);
    })
    scene.obstacles.forEach(({ x, y, width, height, src }) => {
      ctx.drawImage(src.img, 0, 0, src.width, src.height, x, y, width, height);
    })
  }, [scene.length, scene.frames, scene.obstacles]);
  return <div className="scene-container">
    <canvas ref={background} style={style} className="scene-background"/>
  </div>
}

export default Scene;