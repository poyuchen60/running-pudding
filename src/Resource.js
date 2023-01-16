import { useRef } from 'react';

function Resource({ request }){
  const ref = useRef({});
  const { list, commit } = request;
  
  const imgs = list.map( ({ name, src })=> <img
    src={src}
    ref={(ele) => ref.current[name] = ele}
    onLoad={() => commit(name, ref.current[name])} alt={name}
    key={name}
  />)

  return <div style={{ display: 'none' }}>
    {imgs}
  </div>
}

export default Resource;