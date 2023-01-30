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

function useGame(viewport){
  const [ game, setGame ] = useState(() => newGame(viewport, true));
  const [ p1, setP1 ] = useState(game.state.pudding);
  const [ p2, setP2 ] = useState(game.state.goose);
  const [ phase, setPhase ] = useState(game.state.status);
  const [ spend, setSpend ] = useState(0);

  const list = useMemo(() => {
    const fList = Object.keys(game.scene.frames.reduce((r, f) => {
      r[f.name] = true;
      return r;
    }, {})).reduce((r, k) => {
      const fSet = fSettings[k];
      r.push({ name: fSet.name, src: fSet.src });
      Object.values(fSet.obstacles).forEach(o => r.push({ ...o }));
      return r;
    }, []);
    const cList = game.characters.map(c => ({ name: c, src: cSettings[c].src }));
    return [ ...fList, ...cList ];
  }, [game]);
  const { request, ready } = useResource(list);
  const scene = useMemo(() => {
    const { frames, length, obstacles } = game.scene;
    return ready && {
      frames: frames.map(f => ({ ...f, src: ready[f.name] })),
      length, obstacles: obstacles.map(o => {
        const temp = {
          ...o, y: 445 - o.height - o.y, src: { img: ready[o.name], ...fSettings[frames[o.belongs].name].obstacles[o.name].size }
        };
        return temp;
      })
    }
  }, [game, ready]);
  const data = ready && {
    pudding: {
      ...p1,
      x: Math.max(p1.x - (scene.length - viewport.width), 100),
      y: viewport.height - p1.height - p1.y - 55,
      src: {
        img: ready.pudding,
        width: cSettings.pudding.width,
        height: cSettings.pudding.height
      },
      size: 105,
      adjustment: {
        top: -22,
        left: -12
      },
      animations: cSettings.pudding.animations
    },
    goose: {
      ...p2,
      x: Math.max(p2.x - (scene.length - viewport.width), p2.x - p1.x + 100),
      y: viewport.height - p2.height - p2.y - 55,
      src: {
        img: ready.goose,
        width: cSettings.goose.width,
        height: cSettings.goose.height,
      },
      size: 100,
      adjustment: {
        top: -25,
        left: -3
      },
      animations: cSettings.goose.animations
    },
    scene: { ...scene, x: Math.max(100 - p1.x, viewport.width - scene.length) }
  };

  const jump = useCallback(() => game.command("jump"), [game]);
  const pause = useCallback(() => setPhase(game.command("pause")), [game]);
  const restart = useCallback((pause) => setGame(newGame(viewport, pause)), [viewport]);
  useEffect(() => {
    let id;
    const step = (timestamp) => {
      const { pudding, goose, status, grade } = game.progress(timestamp).state;
      setP1(pudding);
      setP2(goose);
      setPhase(status);
      setSpend(grade);
      id = window.requestAnimationFrame(step);
    }
    id = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(id);
  }, [game])

  return { pause, jump, data, request, restart, phase, spend };
}

export default useGame;