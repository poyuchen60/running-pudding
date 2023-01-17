const Action = {};
Action.base = {
  fulfill: function(newValue){
    (newValue.next.shift() || Action.running).initialize(newValue);
  },
  commit: function(c, newValue){
    Object.entries(newValue).forEach(([key, value]) => c[key] = value);
  }
}
Action.running = {
  ...Action.base,
  name: "running",
  initialize: function(c, options={}){
    const { xMax, vx } = options;
    c.xMax = xMax || 25000;
    c.vx = vx || c.powerX;
    c.ax = 0;
    c.vxEnd = 0;
    c.x = c.x + c.vx * c.gap + c.fixX;
    c.gap = 0;
    c.fixX = 0;
    c.action = this;
  },
  check: function(c, newValue){
    if(newValue.x >= c.xMax){
      const gap =  (newValue.x - c.xMax) / newValue.vx;
      newValue.gap = gap;
      newValue.x = c.xMax;
      newValue.next.length === 0 && newValue.next.push(Action.resting);
      this.fulfill(newValue);
    }
    this.commit(c, newValue);
  }
}
Action.accelerating = {
  ...Action.base,
  name: "accelerating",
  initialize: function(c, options={}){
    console.log("accelerating");
    console.log(c.gap);
    const { ax, xMax, vx, vxEnd } = options;
    c.xMax = xMax || 25000;
    c.vx = vx || c.vx;
    c.ax = ax || c.ax;
    if(ax === 0)
      throw new Error("must have acceleration");
    c.vxEnd = vxEnd || c.vxEnd || ( c.ax > 0 ? 2 : 0);
    c.x = c.x + c.vx * c.gap + 0.5 * ax * c.gap**2 + c.fixX;
    c.vx += c.ax * c.gap;
    c.gap = 0;
    c.fixX = 0;
    c.action = this;
  },
  check: function(c, newValue){
    const { x, ax, vx, vxEnd } = newValue;
    if((ax > 0 && vx >= vxEnd) || (ax < 0 && vx <= vxEnd)){
      const gap = -(vxEnd - vx) / ax;
      console.log("Gap1", gap, newValue.gap);
      newValue.gap = gap;
      newValue.x = x - (vx**2 - vxEnd**2) / (2 * ax);
      newValue.ax = 0;
      newValue.vx = vxEnd;
      this.fulfill(newValue);
    } else if(x >= c.xMax){
      const gap = -(-vx - Math.sqrt(vx**2 - 2 * ax * (x - c.xMax))) / ax;
      console.log("Gap", gap);
      newValue.gap = gap;
      newValue.x = c.xMax;
      this.fulfill(newValue);
    }
    this.commit(c, newValue);
  }
}
Action.resting = {
  ...Action.base,
  name: "resting",
  initialize: function(c, time=100000){
    c.vx = c.ax = 0;
    c.left = time - c.gap;
    c.gap = 0;
    c.action = this;
  },
  check: function(c, newValue){
    if(newValue.left <= 0){
      newValue.gap = -newValue.left;
      newValue.left = 0;
      this.fulfill(newValue);
    }
    Object.entries(newValue).forEach(([key, value]) => c[key] = value);
  }
}
Action.jumping = {
  ...Action.base,
  name: "jumping",
  initialize: function(c){
    c.vy = c.powerY;
    c.ay = -0.0078;
    c.action = this;
  },
  check: function(c, newValue){
    const { y } = newValue;
    if(y <= 0){
      newValue.y = 0;
      newValue.vy = 0;
      newValue.ay = 0;
      this.fulfill(newValue);
    }
    this.commit(c, newValue);
  }
}

Action.falling = {
  ...Action.base,
  name: "falling",
  initialize: function(c){
    c.vx = 0;
    c.vy = 0;
    c.ay = -0.0078;
    c.action = this;
    console.log("falling");
  },
  check: function(c, newValue){
    const { y, vy, ay } = newValue;
    if(y <= 0){
      const gap = -(-vy - Math.sqrt(vy**2 - 2 * ay * y)) / ay;
      newValue.gap += gap;
      // console.log(gap, y, vy, ay);
      newValue.y = 0;
      newValue.vy = 0;
      newValue.ay = 0;
      this.fulfill(newValue);
    }
    this.commit(c, newValue);
  }
}

Action.restoring = {
  ...Action.base,
  name: "restoring",
  initialize: function(c, time=800){
    c.vx = c.vy = 0;
    c.ax = c.ay = 0;
    c.left = time - c.gap;
    c.invulnerable = c.invulnerable - c.gap;
    c.gap = 0;
    c.action = this;
    console.log("restoring");
  },
  check: function(c, newValue){
    if(newValue.left <= 0){
      newValue.gap = -newValue.left;
      newValue.left = 0;
      this.fulfill(newValue);
    }
    this.commit(c, newValue);
  }
}

const optionsBinder = (action, options) => {
  return {
    initialize: (c) => action.initialize(c, options)
  }
}

const gapFinder = (c, collider) => {
  let gap, newY, newX;
  gap = Math.min(
    (-(-c.vy + (c.vy > 0 ? 1 : -1) * Math.sqrt((c.vy)**2 - 2 * c.ay * (c.y - (collider.y + (c.vy > 0 ? -c.height : collider.height))))) / c.ay) || 0,
    ((c.x + c.width) - collider.x) / c.vx
  );
  newX = c.x + c.vx * -gap;
  newY = c.y + c.vy * -gap + 0.5 * c.ay * gap**2;
  if(isNaN(newY)) throw new Error(`c:${JSON.stringify(c)}, collider:${JSON.stringify(collider)}, gap:${gap}`);
  return { newX, newY, gap };
}

const CharacterManager = (init) => {
  const characters = structuredClone(init).reduce((r, c) => {
    c.next = c.next ? c.next.map(n => Action[n]) : [];
    c.left = 0;
    c.invulnerable = 0;
    c.gap = 0;
    c.fixX = 0;
    Action[c.action].initialize(c);
    r[c.name] = c;
    return r;
  }, {})
  const update = (time) => {
    Object.values(characters).forEach((c, i) => {
      const { vx, vy, ax, ay, x, y, action, left, invulnerable } = c;
      const newValue = {
        ...c,
        x: x + vx * time + 0.5 * ax * time**2,
        // x: x + vx * time,
        y: y + vy * time + 0.5 * ay * time**2,
        vx: vx + ax * time,
        vy: vy + ay * time,
        left: left > 0 ? left - time : left,
        invulnerable: invulnerable > 0 ? invulnerable - time : 0,
      }
      // i === 1 && console.log(x);
      action.check(c, newValue, time);
    })
    console.log("p:", characters["goose"].x , characters["pudding"].x, characters["goose"].x - characters["pudding"].x);
  }
  const isFree = (name) => characters[name].action.name === "running";
  const isVulnerable = (name) => characters[name].invulnerable <= 0;
  const moveForwardAndRest = (name, position, cost, resting) => {
    const c = characters[name];
    optionsBinder(Action.running, { vx: 0.8, xMax: position }).initialize(c);
    c.next.push(optionsBinder(Action.resting, 800 - 300 / 0.8));
    // resting > 0 && c.next.push(optionsBinder(Action.resting, resting));
    c.next.push(optionsBinder(Action.accelerating, { ax: 600 / (4000**2), vx: 0.8 - 600 / 4000, vxEnd: 0.8 }));
  }
  const hurt = (name, collider) => {
    const c = characters[name];
    switch(c.action.name){
      case "jumping":
        const { newX, newY, gap } = gapFinder(c, collider);
        c.y = newY;
        c.x = newX;
        c.fixX = c.vx * gap;
        c.invulnerable = 1500;
        const fallingTime = Math.sqrt(-2 * newY / c.ay);
        console.log(fallingTime);
        Action.falling.initialize(c);
        c.next.push(optionsBinder(Action.restoring, 800 - fallingTime));
        break;
      case "running":
        c.invulnerable = 1500;
        c.gap = ((c.x + c.width) - collider.x) / c.vx;
        c.x = collider.x - c.width;
        Action.restoring.initialize(c);
        break;
      default:
        throw new Error(`invalid action(${c.action.name}) of hurting`);
    }
  }
  const jump = (name) => isFree(name) && Action.jumping.initialize(characters[name]);
  const getPosition = (name) => ({
    name,
    width: characters[name].width, height: characters[name].height,
    x: characters[name].x, y: characters[name].y,
    action: characters[name].action.name,
    vx: characters[name].vx
  });
  const getAll = () => Object.values(characters).map(c => c.name);
  return { update, jump, getPosition, getAll, isVulnerable, hurt, moveForwardAndRest };
}

const SceneManager = (init) => {
  let { frames, length, obstacles } = init.reduce((r, f, index) => {
    r.frames = [ ...r.frames, { name: f.name, length: f.length, offset: r.length }];
    r.obstacles = [ ...r.obstacles, ...f.obstacles.map(o => ({ ...o, x: o.x + r.length, belongs: index }))];
    r.length += f.length;
    return r;
  }, { frames: [], obstacles: [], length: 0 })

  const colideMap = {
    "0213": "small",
    "2031": "big",
    "2013": "sink",
    "0231": "contain"
  }
  const isOverlapping = (o1, o2) => {
    const { x: x1, y: y1, width: w1, height: h1 } = o1;
    const { x: x2, y: y2, width: w2, height: h2 } = o2;
    const dotX = [x1, x1 + w1, x2, x2 + w2];
    const orderX = [0, 1, 2, 3].sort((a, b) => dotX[a] - dotX[b]);
    const collideX = colideMap[`${orderX[0]}${orderX[1]}${orderX[2]}${orderX[3]}`]
    const dotY = [y1, y1 + h1, y2, y2 + h2];
    const orderY = [0, 1, 2, 3].sort((a, b) => dotY[a] - dotY[b]);
    const collideY = colideMap[`${orderY[0]}${orderY[1]}${orderY[2]}${orderY[3]}`]
    return collideX && collideY && { x: collideX, y: collideY };
  }
  const isColliding = (c) => {
    let type;
    const collider = obstacles.find(o => type = isOverlapping(c, o));
    return collider && { ...collider, type };
  };

  return {
    isColliding,
    get length(){ return length },
    get scene(){ return structuredClone({ frames, length, obstacles }) }
  }
}

const generator = () => {
  const SM = SceneManager([
    { name: 'loveriver', length: 10000, obstacles: [
      { name: "pipe", x: 1000, y: 0, width: 150, height: 50 },
      { name: "pipe", x: 2000, y: 55, width: 60, height: 120 },
      { name: "pipe", x: 3000, y: 70, width: 400, height: 80 },
    ] },
    { name: 'pier2', length: 10000, obstacles: [
      { name: "pipe", x: 1000, y: 0, width: 100, height: 100 },
      { name: "pipe", x: 2000, y: 145, width: 80, height: 120 },
      { name: "pipe", x: 3000, y: 65, width: 140, height: 50 },
    ] },
    { name: 'museumofarts', length: 10000, obstacles: [
      { name: "pipe", x: 500, y: 0, width: 100, height: 100 },
      { name: "pipe", x: 1800, y: 145, width: 80, height: 120 },
      { name: "pipe", x: 3000, y: 185, width: 120, height: 80 },
    ] },
  ]);
  const CM = CharacterManager([
    {
      name: "pudding", x: 100, y: 0, vx: 0.8, vy: 0, ax: 0, ay: 0, action: "running",
      width:83, height: 62, powerX: 0.8, powerY: 2, vxMax: 0.7
    },
    {
      name: "goose", x: 300, y: 0, vx: 0.8, vy: 0, ax: 0, ay: 0, action: "running",
      width:83, height: 62, powerX: 0.8, powerY: 2, vxMax: 0.7
    }
  ]);

  let start, last;
  let leading = 0;
  const progress = function(timestamp){
    if(!start){
      start = last = timestamp;
    } else {
      const time = timestamp - last;
      last = timestamp;
      leading = Math.max(leading - time, 0);
      console.log("time:", last);
      CM.update(time);
      if(CM.isVulnerable("pudding")){
        const c = CM.getPosition("pudding");
        const collider = SM.isColliding(c);
        if(collider){
          const { x, vx } = c;
          leading += 4000;
          console.log("pudding:", x, vx, leading);
          CM.hurt("pudding", collider);
          CM.moveForwardAndRest(
            "goose",
            x + 500 + (leading - 4000) * vx,
            800,
            leading - 4000
          );
        }
      }
    }
    return this;
  }
  const command = (cmd) => {
    switch(cmd){
      case "jump":
        CM.jump("pudding");
        break;
      case "pause":
        break;
      default:
        throw new Error("invalid command of game");
    }
  }

  return {
    progress, command,
    get state(){
      return {
        pudding: CM.getPosition("pudding"),
        goose: CM.getPosition("goose")
      }
    },
    get scene(){
      return SM.scene;
    },
    get characters(){
      return CM.getAll();
    }
  };
}

export default generator;