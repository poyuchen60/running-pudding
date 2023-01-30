import './App.css';
import Resource from './Resource';
import Character from './Character';
import Scene from './Scene';
import useGame from './useGame';
import { useEffect, useState } from 'react';
import Menu from './Menu';
import Main from './Main';
import Result from './Result';

const hintGenerator = (phase, spend) => {
  switch(phase){
    case "succeeded":
      return { title: "成功", msg: [`耗時: ${spend} 秒`, "布丁很開心"], img: process.env.PUBLIC_URL + '/succeeded.jpg'}
    case "failed":
      return { title: "失敗", msg: ["撞太多下，頭太暈", "被鵝跑走了..."] }
    default:
      return undefined;
  }
}

function App() {
  const [ size, setSize ] = useState({ width: window.innerWidth, height: Math.min(window.innerHeight, 500) });
  const { jump, data, request, pause, phase, restart, spend } = useGame(size);
  const [ route, setRoute ] = useState('/');
  const hint = hintGenerator(phase, spend);
  const handleClick = () => {
    jump();
  };
  const handleStart = () => {
    pause();
    setRoute('/game');
  }
  const handlePause = () => pause();
  const handleRestart = () => restart();
  const handleReturn = () => {
    restart(true);
    setRoute('/');
  }
  const handleTouchEnd = (e) => {
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
    <div className='game'>
      {route === '/' && <Main ready={!!data} handleStart={handleStart} />}
      {hint && <Result data={hint} handleRestart={handleRestart} handleReturn={handleReturn}/>}
      {data && <>
        <Menu phase={phase} handlePause={handlePause} handleRestart={handleRestart} handleReturn={handleReturn}/>
        <Character pudding={data.pudding} goose={data.goose} />
        <Scene scene={data.scene} />
        <div className='game-touch' onTouchStart={handleClick} onTouchEnd={handleTouchEnd} onMouseDown={handleClick}></div>
      </>}
    </div>
    <Resource request={request} />
  </div>
}

export default App;
