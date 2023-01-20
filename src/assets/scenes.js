import Background from './background.png';
import Bigbush from './obstacles/bigbush1x1.png';
import Bush1x1 from './obstacles/bush1x1.png';
import Bush1x3 from './obstacles/bush1x3.png';
import Kasa3x1 from './obstacles/kasa3x1.png';
import Rock1x1 from './obstacles/rock1x1.png';
import Rock1x2 from './obstacles/rock1x2.png';
import Rock1x3 from './obstacles/rock1x3.png';
import Tree2x1 from './obstacles/tree2x1.png';

const scenes = {
  museumofarts: {
    name: "museumofarts",
    src: Background,
    obstacles: {
      bigbush: { name: "bigbush", src: Bigbush, size: { width: 200, height: 200 } },
      bush1x1: { name: "bush1x1", src: Bush1x1, size: { width: 50, height: 50 } },
      bush1x3: { name: "bush1x3", src: Bush1x3, size: { width: 150, height: 50 } },
      kasa3x1: { name: "kasa3x1", src: Kasa3x1, size: { width: 50, height: 150 } },
      rock1x1: { name: "rock1x1", src: Rock1x1, size: { width: 200, height: 200 } },
      rock1x2: { name: "rock1x2", src: Rock1x2, size: { width: 150, height: 75 } },
      rock1x5: { name: "rock1x5", src: Rock1x3, size: { width: 400, height: 80 } },
      tree2x1: { name: "tree2x1", src: Tree2x1, size: { width: 60, height: 120 } },
    }
  }
}

export default scenes;