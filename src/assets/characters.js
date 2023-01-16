import Dog from './dog.png';
import Goose from './shiba.png';

const characters = {
  pudding: {
    name: "pudding",
    src: Dog,
    animations: {
      running: {
        name: 'running',
        frames: [{ x: 0, y: 8 }, { x: 1, y: 8 }, { x: 2, y: 8 }],
        interval: 90
      },
      sitting: {
        name: 'sitting',
        frames: [{ x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }],
        interval: 100,
        notrepeat: true
      },
      jumping: {
        name: 'jumping',
        frames: [{ x: 3, y: 5 }],
        interval: 100,
        notrepeat: true
      },
      falling: {
        name: 'falling',
        frames: [{ x: 0, y: 8 }],
        interval: 100,
        notrepeat: true
      },
      restoring:{
        name: 'restoring',
        frames: [{ x: 0, y: 7 }, { x: 1, y: 7 }],
        interval: 100,
      }
    }
  },
  goose: {
    name: "goose",
    src: Goose,
    animations: {
      running: {
        name: 'running',
        frames: [{ x: 0, y: 8 }, { x: 1, y: 8 }, { x: 2, y: 8 }],
        interval: 90
      },
      sitting: {
        name: 'sitting',
        frames: [{ x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }],
        interval: 100,
        notrepeat: true
      },
      jumping: {
        name: 'jumping',
        frames: [{ x: 3, y: 5 }],
        interval: 100,
        notrepeat: true
      },
      falling: {
        name: 'falling',
        frames: [{ x: 0, y: 8 }],
        interval: 100,
        notrepeat: true
      },
      restoring:{
        name: 'restoring',
        frames: [{ x: 0, y: 7 }, { x: 1, y: 7 }],
        interval: 100,
      }
    }
  }
}

export default characters;