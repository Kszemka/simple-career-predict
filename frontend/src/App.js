import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import ResultCard from "./components/ResultCard";
import StartCard from "./components/StartCard";
import { ToastContainer, toast } from "react-toastify";

const LONG_QUESTIONS = 1;

function App() {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [result, setResult] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [step, setStep] = useState("start"); // "start", "quiz", "result"

  const scale = [1, 2, 3, 4, 5]; // Scale for responses

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    setErrorMessage(null);
    let url;
    if (LONG_QUESTIONS) {
      url = "/questions_long.json";
    } else {
      url = "/questions.json";
    }
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
        if (shuffled.length === 0) {
          throw new Error("No questions");
        }

        const initialResponses = shuffled.reduce((acc, { category }, index) => {
          acc[index] = null;
          return acc;
        }, {});
        setResponses(initialResponses);
      })
      .catch((error) => {
        console.error("Error loading questions:", error);
        setErrorMessage("Błąd podczas pobierania pytań");
      });
  };

  const handleRadioChange = (index, value) => {
    const newResponses = { ...responses };
    const question = questions[index];
    if (question.keyed === "minus") {
      // Odwróć wartość punktów
      newResponses[index] = 6 - value;
    } else {
      newResponses[index] = value;
    }
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

    setIsPending(true);
    setErrorMessage(null);

    questions.forEach(({ category }, index) => {
      formattedResponses[category].push(responses[index]);
    });

    await fetch("/submit_scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedResponses),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setResult(data.predicted_career);
        setStep("result");
      })
      .catch((error) => {
        console.error("Error submitting scores:", error);
        toast.error("Błąd połączenia z serwerem. Spróbuj ponownie.", {
          position: "top-right",
          theme: "colored",
        });
      });
    setIsPending(false);
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
  const currentQuestion = questions[currentQuestionIndex] || 0;
  return (
    <>
      {step === "start" && <StartCard click={() => setStep("quiz")} error={errorMessage} />}
      {step === "result" && <ResultCard result={result} handleRestart={handleRestart} />}
      {step === "quiz" && (
        <>
          <div className="App">
            <div className="container mt-5 d-flex flex-column justify-content-center align-items-center">
              {/* <h1 className="text-center">Inteligentny Asystent do predykcji najbardziej odpowiedniego zawodu w oparciu o testy osobowości</h1> */}
              <div className="card p-4 mt-5 shadow border border-0" style={{ width: "50rem" }}>
                <div className="card-body">
                  <h6 className="d-flex pb-5">
                    <div>Pytanie</div>
                    <div className="text-center" style={{ width: "2rem" }}>
                      {currentQuestionIndex + 1}
                    </div>
                    /
                    <div className="text-center" style={{ width: "2rem" }}>
                      {questions.length}
                    </div>
                  </h6>
                  <h5 className="text-center pb-5">{currentQuestion.question}</h5>
                  <form className="pb-3">
                    <div className="d-flex align-items-center justify-content-center gap-4">
                      <div className="btn-toolbar">
                        <button className="btn btn-outline-danger me-3 fw-semibold" style={{ width: "140px", fontSize: "smaller" }} disabled={true}>
                          Nie zgadzam się
                        </button>
                        <div className="btn-group me-3" role="group">
                          {scale.map((number) => (
                            <React.Fragment key={number}>
                              <input
                                type="radio"
                                name={`question-${currentQuestionIndex}`}
                                className="btn-check"
                                id={`option-${number}`}
                                value={number}
                                autoComplete="off"
                                checked={currentQuestion.keyed === "minus" ? responses[currentQuestionIndex] === 6 - number : responses[currentQuestionIndex] === number}
                                onChange={() => handleRadioChange(currentQuestionIndex, number)}
                              />
                              <label className="btn btn-outline-primary" htmlFor={`option-${number}`}>
                                {number}
                              </label>
                            </React.Fragment>
                          ))}
                        </div>
                        <button className="btn btn-outline-success fw-semibold" style={{ width: "140px", fontSize: "smaller" }} disabled={true}>
                          Zgadzam się
                        </button>
                      </div>
                    </div>
                  </form>
                  <div className="d-flex justify-content-between pt-4">
                    <button className="btn btn-secondary text-center" style={{ width: "150px" }} onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-left-circle-fill me-2" viewBox="0 0 18 18">
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                      </svg>
                      <span>Poprzednie</span>
                    </button>
                    {currentQuestionIndex < questions.length - 1 ? (
                      <button className="btn btn-primary text-center" style={{ width: "150px" }} onClick={handleNext} disabled={responses[currentQuestionIndex] === null}>
                        <span className="me-2">Następne</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-right-circle-fill" viewBox="0 0 18 18">
                          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                        </svg>
                      </button>
                    ) : (
                      <button className="btn btn-success text-center" style={{ width: "150px" }} onClick={handleSubmit} disabled={!allAnswered || isPending}>
                        {isPending ? (
                          <div className="spinner-grow text-light" style={{ width: "1rem", height: "1rem" }} role="status"></div>
                        ) : (
                          <div>
                            <span className="me-2">Wyślij</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 18 18">
                              <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                            </svg>
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
        </>
      )}
    </>
  );
}

export default App;
