const mGeneratorInit = (to) => {
  let x = to.x, y = to.y
  let last;
  const progress = (current) => {
    last = current;
    return to;
  }

  return {
    progress,
    get x(){ return x },
    get y(){ return y },
    get last(){ return last }
  };
}

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

const aGenerator2 = ({ frames, interval, notrepeat, offset, name }, start) => {
  let last;
  const calculate = (number) => {
    number = Math.floor(number);
    return notrepeat
      ? frames[ number >= frames.length ? (frames.length - 1) : number]
      : frames[ number % frames.length]
  }
  const begin = () => {
    start = start || performance.now();
    last = offset;
    return calculate(last);
  }
  const progress = (current) => {
    if(!current)
      throw new Error("Called with no timestamp");
    if(!start){
      throw new Error("Called without start");
    }
    last = (current - start) / interval + (offset || 0);
    return calculate(last);
  }
  return { begin, progress, name, get last(){ return last } };
}

const interpolation = (from, to, ratio) => {
  const { x: fx, y: fy } = from;
  const { x: tx, y: ty } = to;
  return {
    x: fx + (tx - fx) * ratio,
    y: fy + (ty - fy) * ratio
  };
};

const mGenerator = (from, to, duration) => {
  let start, x = from.x, y = from.y;
  const progress = (current) => {
    if(!start){
      start = current;
    } else {
      const ratio = (current - start) / duration;
      const now = interpolation(from, to, ratio)
      const result = ratio < 1 ? now : to;
      x = result.x;
      y = result.y;
    }
    return { x, y };
  }
  return {
    progress,
    get x(){ return x },
    get y(){ return y }
  };
}

const mGeneratorRotaterX = (origin, v, unit, from) => {
  let start;
  let x = from.x, y = from.y;
  const progress = (current) => {
    if(!start){
      start = current;
    } else {
      const delta = (current - start) * v;
      const offset = origin - from.x;
      x = origin + (delta - offset) % (unit * 3);
    }
    return { x, y };
  }
  return {
    progress,
    get x(){ return x },
    get y(){ return y }
  };
}

const rotate = (v, unit, index, frames) => {
  let beginning;
  const end = ({ movement }) => {
    return {
      action: undefined,
      movement: mGeneratorInit(movement),
    }
  }
  const begin = function({ movement, animation }){
    if(animation?.name === frames){
      beginning = {
        action: this,
        movement: mGeneratorRotaterX(
          unit * 2, v, unit,
          movement || { x: unit * index, y: 0 }
        ),
        animation: aGenerator({
          name: frames,
          frames: frames.filter((_, i) => i % 3 === index),
          interval: Math.abs(3 * unit / v),
          offset: animation.last
        })
      }
    } else {
      beginning = {
        action: this,
        movement: mGeneratorRotaterX(
          unit * 2, v, unit,
          { x: unit * index, y: 0 }
        ),
        animation: aGenerator2({
          name: frames,
          frames: frames.filter((_, i) => i % 3 === index),
          interval: Math.abs(3 * unit / v),
          offset: (2 - index) / 3
        })
      }
    }
    return beginning;
  }
  const progress = () => {
    return beginning
  }

  return { begin, progress, end }
}

const mGeneratorWithAcce = (from, v, a, duration, start) => {
  let last;

  const toX = from.x + v.x * duration + 0.5 * a.x * duration**2;
  const toY = from.y + v.y * duration + 0.5 * a.y * duration**2;

  let x = from.x, y = from.y;
  const calculate = (time) => {
    if(time < duration){
      x = from.x + v.x * time + 0.5 * a.x * time**2;
      y = from.y + v.y * time + 0.5 * a.y * time**2;
    } else {
      x = toX;
      y = toY;
    }
    return { x, y };
  }
  const begin = () => {
    last = start
    return calculate(start - from.last);
  }
  const progress = (current) => {
    if(!start){
      throw new Error("Called without start");
    }
    last = current;
    calculate(last - start)
    return { x, y };
  }
  return {
    begin,
    progress,
    get x(){ return x },
    get y(){ return y },
    get last(){ return last }
  };
}

const jump = (v, g, specs, to) => {
  let start, last;
  let beginning;
  let duration;
  const end = ({ movement }) => {
    duration = 0;
    return {
      action: undefined,
      movement: mGeneratorInit(movement),
      animation: aGenerator(specs['running'])
    }
  }
  const begin = function({ movement }){
    start = performance.now();
    duration = ( -v.y + Math.sqrt(v.y**2 + 2 * g.y * (to.y - movement.y))) / g.y;
    if(duration < 0) throw new Error("invalid combination of v and g");
    beginning = {
      action: this,
      animation: aGenerator2(specs['jumping'], start),
      movement: mGeneratorWithAcce(movement, v, g, duration, start)
    }
    return beginning
  }
  const progress = (current) => {
    if(!start){
      throw new Error("Should begin first");
    }
    last = current;
    return (last - start > duration)
      ? end({ movement: to })
      : beginning
  }

  return { end, progress, begin };
}

const init = (spec, position) => {
  const begin = () => {
    return { animation: aGenerator(spec), movement: mGeneratorInit(position), action: undefined }
  }
  return { begin }
}

export { init, jump, mGenerator, mGeneratorRotaterX, rotate }