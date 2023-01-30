function Main({ ready, handleStart }){

  return <div className="main">
      <h1>追鵝小丁</h1>
      { ready ? <button onClick={handleStart}>開始遊戲</button> : <p>Loading...</p> }
  </div>
}

export default Main;