import './App.css';
import Resource from './Resource';
import Character from './Character';
import Scene from './Scene';
import useGame from './useGame';
import { useEffect, useState } from 'react';
import Menu from './Menu';

function App() {
  const [ size, setSize ] = useState({ width: window.innerWidth, height: Math.min(window.innerHeight, 500) });
  const { jump, data, request, pause, phase, restart } = useGame(size);
  const handleClick = () => {
    console.log("jump");
    jump();
  };
  const handlePause = () => pause();
  const handleRestart = () => restart();
  const handleTouchEnd = (e) => {
    console.log("touch");
    e.preventDefault();
  };

  useEffect(() => {
    const onResize = () => {
      setSize({
        width: window.innerWidth,
        height: Math.min(window.innerHeight, 500)
      });
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [])

  return <div className="App">
    {data
      ? <div className='game'>
        <Menu phase={phase} handlePause={handlePause} handleRestart={handleRestart} />
        <Character pudding={data.pudding} goose={data.goose} />
        <Scene scene={data.scene} />
        <div className='game-touch' onTouchStart={handleClick} onTouchEnd={handleTouchEnd} onMouseDown={handleClick}></div>
      </div>
      : "Loading..."
    }
    <Resource request={request} />
  </div>
}

export default App;
