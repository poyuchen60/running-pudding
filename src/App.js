import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import Resource from './Resource';
import Character from './Character';
import { init, jump } from './Action';
import settings from './assets/characters';
import Scene from './Scene';

const obstacles = [
  { position: { x: 500, y: 165 }, width: 100, height: 100 },
  { position: { x: 1500, y: 145 }, width: 80, height: 120 },
  { position: { x: 2000, y: 185 }, width: 120, height: 80 }
]

const frames = [
  { background: "linear-gradient(0.25turn, #3f87a6, #ebf8e1)", obstacles },
  { background: "linear-gradient(0.25turn, #f69d3c, #ebf8e1)", obstacles },
  { background: "linear-gradient(0.25turn, #e66465, #ebf8e1)", obstacles },
  { background: "PaleTurquoise", obstacles: [] },
  { background: "PaleGreen", obstacles: [] },
  { background: "Salmon", obstacles: [] },
]

const isColliding = (o1, o2) => {
  const { position: { x: x1, y: y1 }, width: w1, height: h1 } = o1;
  const { position: { x: x2, y: y2 }, width: w2, height: h2 } = o2;
  const xCollide = ((x1 >= x2) && (x1 <= x2 + w2)) || ((x2 >= x1) && (x2 <= x1 + w1));
  const yCollide = ((y1 >= y2) && (y1 <= y2 + h2)) || ((y2 >= y1) && (y2 <= y1 + h1));
  return xCollide && yCollide;
}

function App() {
  const condition = useRef({});

  const [ resource, setResource ] = useState({});
  const [ hurt, setHurt ] = useState(false);
  const [ speed, setSpeed ]= useState(-0.7)
  const [ action, setAction ] = useState(init(settings.dog.animations.running, { x: 100, y: 175 }));
  const store = useCallback((key, value) => setResource(old => ({ ...old, [key]: value })), []);
  const handleClick = () => {
    !(condition.current.character.y < 175) && setAction(jump(
      { x: 0, y: -1.5 },
      { x: 0, y: 0.006 },
      settings.dog.animations,
      { x: 100, y: 175 }
    ));
  }
  const handleSpeed = (value) => setSpeed(value);
  const monitor = useCallback((key, value) => {
    condition.current[key] = value;
  }, []);

  useEffect(() => {
      
      let id;
      const step = () => {
        const c = { position: condition.current.character, width: 96, height: 96 };
        setHurt([
          ...condition.current['Frame0'].obstacles,
          ...condition.current['Frame1'].obstacles,
          ...condition.current['Frame2'].obstacles, 
        ].some(o => isColliding(c, o)));
        id = window.requestAnimationFrame(step);
      }
      id = window.requestAnimationFrame(step);
      return () => window.cancelAnimationFrame(id);
  }, [])

  return <div className="App">
    <div className='game'>
      <div className='characters'>
        <Character src={resource['dog']} action={action} monitor={monitor} />
      </div>
      <Scene speed={speed} frames={frames} monitor={monitor} />
      {hurt && <div className='hurt'></div>}
      <div className='jump-button' onClick={handleClick}></div>
    </div>
    <button onClick={handleClick}>Jump</button>
    <button onClick={() => handleSpeed(-0.7)}>1</button>
    <button onClick={() => handleSpeed(-1)}>2</button>
    <button onClick={() => handleSpeed(-1.5)}>3</button>
    <button onClick={() => handleSpeed(0)}>pause</button>
    <Resource store={store} />
  </div>
}

export default App;
