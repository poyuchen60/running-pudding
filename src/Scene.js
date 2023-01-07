import { useEffect, useState } from "react";
import useAnimation from "./useAnimation";
import { rotate } from "./Action";

function Frame({ action, index, monitor }){
  const { position, frame: { background, obstacles } } = useAnimation(action);
  const style = {
    top: position.y + "px",
    left: position.x + "px",
    background: background
  }
  const objects = obstacles?.map((o, i) => <Obstacle key={i} {...o} />)

  useEffect(() => {
    monitor(`Frame${index}`, { position, obstacles: obstacles.map(o => ({
      ...o,
      position: { x: o.position.x + position.x, y: o.position.y + position.y },
    })) })
  }, [index, position, obstacles, monitor]);
  return <div className="scene-fragment" style={style}>
    {objects}
  </div>
}

function Obstacle({ position, width, height }){
  const style = {
    top: position.y,
    left: position.x,
    width, height
  }
  return <div className="scene-obstacle" style={style}></div>
}

function Scene({ speed, frames, monitor }){
  const [ actions, setActions ] = useState([]);
  const [ preSpeed, setPreSpeed ] = useState(undefined);
  if(preSpeed !== speed){
    setPreSpeed(speed);
    setActions([
      rotate(speed, 3000, 0, frames),
      rotate(speed, 3000, 1, frames),
      rotate(speed, 3000, 2, frames)
    ])
  }

  const content = actions.map((a, i) => <Frame key={i} action={a} index={i} monitor={monitor} />)

  return <div className="scene-container">
    {content}
  </div>
}

export default Scene;