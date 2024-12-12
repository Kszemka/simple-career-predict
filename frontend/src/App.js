import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState("");
  const [step, setStep] = useState("start"); // "start", "quiz", "result"

  const scale = [1, 2, 3, 4, 5]; // Scale for responses

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    fetch("/questions.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);

        const initialResponses = shuffled.reduce((acc, { category }, index) => {
          acc[index] = null;
          return acc;
        }, {});
        setResponses(initialResponses);
      })
      .catch((error) => {
        console.error("Error loading questions:", error);
      });
  };

  const handleRadioChange = (index, value) => {
    const newResponses = { ...responses };
    newResponses[index] = value;
    setResponses(newResponses);
    setErrorMessage("");
  };

  const allAnswered = Object.values(responses).every((response) => response !== null);
  const handleSubmit = async () => {
    const featureOrder = ["O_score", "C_score", "E_score", "A_score", "N_score"];
    const formattedResponses = featureOrder.reduce((acc, feature) => {
      acc[feature] = [];
      return acc;
    }, {});

    questions.forEach(({ category }, index) => {
      formattedResponses[category].push(responses[index]);
    });

    try {
      const response = await fetch("/submit_scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedResponses),
      });

      const data = await response.json();
      setResult(data.predicted_career);
      setStep("result");
    } catch (error) {
      console.error("Error submitting scores:", error);
    }
    // setResult("Zawód rodziców");
    // setStep("result");
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRestart = () => {
    location.reload();
  };

  if (step === "start") {
    return (
      <div className="app">
        <div className="container mt-5 text-center d-flex flex-column justify-content-center align-items-center">
          <h1>Inteligentny Asystent do predykcji najbardziej odpowiedniego zawodu w oparciu o testy osobowości</h1>
          <div className="card p-4 mt-5" style={{ width: "50rem" }}>
            <h5 className="pt-2 mb-4">O projekcie</h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec leo quam, eleifend vitae sapien sed, porttitor porta quam. Integer tortor metus, venenatis sit amet ligula ac, interdum
              cursus ante. Cras quis ante eget erat placerat varius a sit amet quam.
            </p>
            <div className="pt-5">
              <button className="btn btn-primary btn-lg" onClick={() => setStep("quiz")}>
                Rozpocznij test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "result") {
    return (
      <div className="app">
        <div className="container mt-5 text-center d-flex flex-column justify-content-center align-items-center">
          <h1>Inteligentny Asystent do predykcji najbardziej odpowiedniego zawodu w oparciu o testy osobowości</h1>
          <div className="card p-4 mt-5" style={{ width: "50rem" }}>
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
    );
  }
  const currentQuestion = questions[currentQuestionIndex] || 0;
  return (
    <div className="App">
      <div className="container mt-5 d-flex flex-column justify-content-center align-items-center">
        <h1 className="text-center">Inteligentny Asystent do predykcji najbardziej odpowiedniego zawodu w oparciu o testy osobowości</h1>
        <div className="card p-4 mt-5" style={{ width: "50rem" }}>
          <h5>
            Pytanie {currentQuestionIndex + 1} / {questions.length}
          </h5>
          <p>{currentQuestion.question}</p>
          <form>
            <div className="d-flex align-items-center justify-content-around mb-3">
              <label>Nie zgadzam się</label>
              <div className="d-flex justify-content-center">
                {scale.map((number) => (
                  <div key={number} className="form-check mx-2">
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      className="form-check-input"
                      id={`option-${number}`}
                      value={number}
                      checked={responses[currentQuestionIndex] === number}
                      onChange={() => handleRadioChange(currentQuestionIndex, number)}
                    />
                    <label className="form-check-label" htmlFor={`option-${number}`}>
                      {number}
                    </label>
                  </div>
                ))}
              </div>
              <label>Zgadzam się</label>
            </div>
          </form>
          <div className="d-flex justify-content-between mt-4">
            <button className="btn btn-secondary" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              Poprzednie
            </button>
            {currentQuestionIndex < questions.length - 1 ? (
              <button className="btn btn-primary" onClick={handleNext} disabled={responses[currentQuestionIndex] === null}>
                Następne
              </button>
            ) : (
              <button className="btn btn-success" onClick={handleSubmit} disabled={!allAnswered}>
                Wyślij
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
