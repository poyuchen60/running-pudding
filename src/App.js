import './App.css';
import Resource from './Resource';
import Character from './Character';
import Scene from './Scene';
import useGame from './useGame';
import { useEffect, useState } from 'react';

function App() {
  const [ size, setSize ] = useState({ width: window.innerWidth, height: window.innerHeight });
  const { jump, data, request, pause } = useGame();
  const handleClick = () => {
    console.log("jump");
    jump();
  };
  const handlePause = () => pause();
  const handleTouchEnd = (e) => {
    console.log("touch");
    e.preventDefault();
  };

  useEffect(() => {
    const onResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [])

  return <div className="App">
    {data
      ? <div className='game'>
        <Character pudding={data.pudding} goose={data.goose} />
        <Scene scene={data.scene} position={data.pudding} size={size} />
        <div className='game-touch' onTouchStart={handleClick} onTouchEnd={handleTouchEnd} onMouseDown={handleClick}></div>
      </div>
      : "Loading..."
    }
    <Resource request={request} />
    <button onClick={handleClick}>Jump</button>
    <button onClick={handlePause}>Pause</button>
  </div>
}

export default App;
