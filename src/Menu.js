function Menu({ handleRestart, handlePause, phase }){

  const content = phase === "suspending"
    ? <div className="menu-fullscreen">
      <div className="menu-blur" onClick={handlePause}></div>
      <ul className="menu-normal">
        <li><button onClick={handlePause}>繼續</button></li>
        <li><button onClick={handleRestart}>重來</button></li>
        <li><button>回主頁</button></li>
      </ul>
    </div>
    : <button className="menu-shrink" onClick={handlePause}>M</button>

  return content;
}

export default Menu;