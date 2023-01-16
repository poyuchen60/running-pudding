import { useCallback, useEffect, useMemo, useState } from "react";
import newGame from "./game.js";
import cSettings from './assets/characters';
import fSettings from './assets/scenes';

function useResource(list){
  const [ map, setMap ] = useState({});
  const commit = useCallback((key, value) => setMap(old => ({ ...old, [key]: value })), []);
  const ready = list.every(l => map[l.name]) && map;
  const request = { list, commit }

  return { request, ready };
}

function useGame(){
  const [ game ] = useState(() => newGame());
  const [ p1, setP1 ] = useState(game.state.pudding);
  const [ p2, setP2 ] = useState(game.state.goose);

  const list = useMemo(() => {
    const fList = game.scene.frames.map(f => ({ ...fSettings[f.name] }));
    const cList = game.characters.map(c => ({ name: c, src: cSettings[c].src }));
    return [ ...fList, ...cList ];
  }, [game]);
  const { request, ready } = useResource(list);
  const scene = useMemo(() => {
    const { frames, length, obstacles } = game.scene;
    return ready && {
      frames: frames.map(f => ({ ...f, src: ready[f.name] })),
      length, obstacles
    }
  }, [game, ready]);
  const data = ready && {
    pudding: { ...p1, src: ready.pudding, animations: cSettings.pudding.animations },
    goose: { ...p2, src: ready.goose, animations: cSettings.goose.animations },
    scene
  };

  const jump = useCallback(() => game.command("jump"), [game]);
  const pause = useCallback(() => game.command("pause"), [game]);
  useEffect(() => {
    let id;
    const step = (timestamp) => {
      const { pudding, goose } = game.progress(timestamp).state;
      setP1(pudding);
      setP2(goose);
      id = window.requestAnimationFrame(step);
    }
    id = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(id);
  }, [game])

  return { pause, jump, data, request };
}

export default useGame;