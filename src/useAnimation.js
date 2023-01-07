import { useEffect, useReducer } from 'react';

function timerReducer(state, { payload, type, init }) {
  const { action } = state;
  switch(type) {
    case "TIME_UPDATE":
      return { ...state, ...action?.progress(payload) };
    case "TERMINATE":
      return { ...state, ...action?.end(state), origin: undefined };
    case "SET_STATE":
      return { ...state, ...payload };
    case "ACT":
      return payload?.begin
        ? { ...state, action: payload, ...payload.begin(init || state), origin: payload }
        : { ...state, action: payload, origin: payload };
    default:
      throw new Error("invalid action");
  }
}

function useTimer(action, init) {
  const [ state, dispatch ] = useReducer(timerReducer, init || {});

  if(action !== state.origin){
    action
      ? dispatch({ type: "ACT", payload: action, init })
      : dispatch({ type: "TERMINATE" })
  }

  useEffect(() => {
    let id;
    const step = (timestamp) => {
      dispatch({ type: "TIME_UPDATE", payload: timestamp })
      id = window.requestAnimationFrame(step);
    }
    id = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(id);
  }, [])

  return { state, dispatch };
}

function useAnimation(action) {
  const { state: { animation, movement } } = useTimer(action);
  const { state: frame } = useTimer(animation);
  const { state: position } = useTimer(movement);
  
  return {
    frame,
    position
  }
}

export default useAnimation;
export { useTimer }