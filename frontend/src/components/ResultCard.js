export default function ResultCard({ result, handleRestart }) {
  return (
    <div className="app">
      <div className="container mt-5 text-center d-flex flex-column justify-content-center align-items-center">
        {/* <h1>Inteligentny Asystent do predykcji najbardziej odpowiedniego zawodu w oparciu o testy osobowości</h1> */}
        <div className="card p-4 mt-5 shadow border border-0" style={{ width: "50rem" }}>
          <div className="card-body">
            <h5 className="pt-2 mb-4">Najbardziej odpowiedni zawód</h5>
            <h3 className="py-4 text-success">{result}</h3>
            <div>
              <button className="btn btn-primary mt-4 btn-lg" onClick={handleRestart}>
                Od nowa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
