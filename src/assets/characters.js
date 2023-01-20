import Goose from './goose.png';
import Pudding from './pudding.png';

const characters = {
  pudding: {
    name: "pudding",
    src: Pudding,
    width: 180,
    height: 180,
    animations: {
      running: {
        name: 'running',
        frames: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
        interval: 90
      },
      jumping: {
        name: 'jumping',
        frames: [{ x: 3, y: 0 }],
        interval: 100,
        notrepeat: true
      },
      falling: {
        name: 'falling',
        frames: [{ x: 1, y: 1 }],
        interval: 100,
        notrepeat: true
      },
      restoring:{
        name: 'restoring',
        frames: [{ x: 0, y: 2 }, { x: 1, y: 2 }],
        interval: 100,
      },
      resting:{
        name: 'resting',
        frames: [{ x: 5, y: 0 }, { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }],
        interval: 100,
      }
    }
  },
  goose: {
    name: "goose",
    src: Goose,
    width: 180,
    height: 180,
    animations: {
      running: {
        name: 'running',
        frames: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }],
        interval: 90
      },
      accelerating: {
        name: 'accelerating',
        frames: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
        interval: 90
      },
      jumping: {
        name: 'jumping',
        frames: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
        interval: 100,
        notrepeat: true
      },
      restoring:{
        name: 'restoring',
        frames: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
        interval: 100,
      },
      resting:{
        name: 'resting',
        frames: [{ x: 0, y: 1 }, { x: 1, y: 1 }],
        interval: 400,
      }
    }
  }
}

export default characters;