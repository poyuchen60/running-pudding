import { useRef, useEffect } from "react";
import characters from './assets/characters'
import { useTimer } from './useAnimation';

const aGenerator = (spec) => {
  let start;
  let last;
  const progress = (current) => {
    if(!current)
      return undefined;
    if(!start){
      start = current;
      return spec.frames[0];
    } else{
      const { frames, interval, notrepeat, offset } = spec;
      last = (current - start ) / interval + (offset || 0);
      const number = Math.floor(last)
      return notrepeat
        ? frames[ number >= frames.length ? (frames.length - 1) : number]
        : frames[ number % frames.length]
    }
  }
  return { progress, name: spec.name, get last(){ return last } };
}

const store = {};
const actionManager = (data) => {
  store[data.name] = store[data.name]?.name === data.action
    ? store[data.name]
    : aGenerator(characters[data.name].animations[data.action])
  return { ...data, action: store[data.name] }
}

function Individual({ data }){
  const { x, y, src, action, height, width, adjustment, size } = actionManager(data);
  const { state: frame } = useTimer(action);
  const canvas = useRef(null);
  const style = {
    top: y,
    left: x,
    height, width,
    zIndex: 100
  };
  useEffect(() => {
    if(src){
      const cx = canvas.current.getContext("2d");
      const { x, y } = frame;
      const { img, width, height } = src;
      cx.clearRect(0, 0, width, height);
      cx.drawImage(img, x * width, y * height, width, height, 0, 0, size, size);
    }
  }, [src, frame, size])
  return <div className="individual" style={style}>
    <canvas ref={canvas} height={110} width={110} style={adjustment} />
  </div>
}

function Character({ pudding, goose }) {
  return <div className="character-container">
    <Individual data={goose}/>
    <Individual data={pudding}/>
  </div>
}

export default Character;