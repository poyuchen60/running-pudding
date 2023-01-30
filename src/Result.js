function Result({ data, handleReturn, handleRestart }){
  return <div className="page">
    <div className="result-container">
      <h1>{data.title}</h1>
      {data.msg.map((m, i) => <p key={i}>{m}</p>)}
      <div>
        <button onClick={handleRestart}>再玩一次</button>
        <button onClick={handleReturn}>回首頁</button>
      </div>
      {data.img && <div className="image" style={
        { backgroundImage: `url(${data.img})`}
      }></div>}
    </div>
    
  </div>
}

export default Result