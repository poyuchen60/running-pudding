import Dog from './dog.png';

const characters = {
  dog: {
    src: Dog,
    animations: {
      idling: {
        name: 'idling',
        frames: [{ x: 2, y: 4 }, { x: 3, y: 4 }],
        interval: 150
      },
      walkingleft: {
        name: 'walkingleft',
        frames: [{ x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }],
        interval: 100
      },
      walkingright: {
        name: 'walkingright',
        frames: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }],
        interval: 100
      },
      walkingup: {
        name: 'walkingup',
        frames: [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }],
        interval: 100
      },
      walkingdown: {
        name: 'walkingdown',
        frames: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }],
        interval: 100
      },
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
      }
    }
  }
}

export default characters;