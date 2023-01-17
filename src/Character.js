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

function Individual({ data, offset }){
  const { y, src, action, height, width } = actionManager(data);
  const { state: frame } = useTimer(action);
  const canvas = useRef(null);
  const style = {
    top: 445 - y - height,
    left: offset,
    height, width,
    zIndex: 100
  };
  const adjustment = {
    position: "absolute",
    // display: "none",
    top: -25,
    left: -3
  }
  useEffect(() => {
    if(src){
      const cx = canvas.current.getContext("2d");
      const { x, y } = frame;
      const { img, width, height } = src;
      cx.clearRect(0, 0, width, height);
      cx.drawImage(img, x * width, y * height, width, height, 0, 0, 96, 96);
    }
  }, [src, frame])
  return <div className="individual" style={style}>
    <canvas ref={canvas} height={96} width={96} style={adjustment} />
  </div>
}

function Character({ pudding, goose }) {

  return <div className="character">
    <Individual data={pudding} offset={100}/>
    <Individual data={goose} offset={100 + goose.x - pudding.x}/>
  </div>
}

export default Character;