import { useRef } from 'react';
import characters from './assets/characters';

function Resource({ store }){
  const ref = useRef({});
  const imgs = Object.entries(characters).map(([name, value]) => <img
    src={value.src}
    ref={(ele) => ref.current[name] = ele}
    onLoad={() => store(name, ref.current[name])} alt={name}
    key={name}
  />)

  return <div style={{ display: 'none' }}>
    {imgs}
  </div>
}

export default Resource;