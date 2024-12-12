import React, { useState, useEffect } from 'react';

function App() {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/questions.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
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
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading questions:', error);
        setLoading(false);
      });
  }, []);

  const handleRadioChange = (index, value) => {
    const newResponses = { ...responses };
    newResponses[index] = value;
    setResponses(newResponses);
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    const allAnswered = Object.values(responses).every((response) => response !== null);

    if (!allAnswered) {
      setErrorMessage('Proszę odpowiedzieć na wszystkie pytania.');
      return;
    }

    const featureOrder = ['O_score', 'C_score', 'E_score', 'A_score', 'N_score'];
    const formattedResponses = featureOrder.reduce((acc, feature) => {
      acc[feature] = [];
      return acc;
    }, {});

    questions.forEach(({ category }, index) => {
      formattedResponses[category].push(responses[index]);
    });

    try {
      const response = await fetch('/submit_scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedResponses),
      });

      const data = await response.json();
      setResult(data.predicted_career);
    } catch (error) {
      console.error('Error submitting scores:', error);
    }
  };

  if (loading) {
    return <div>Ładowanie pytań...</div>;
  }

  if (questions.length === 0) {
    return <div>Brak pytań do wyświetlenia.</div>;
  }

  return (
    <div className="App">
      <form onSubmit={(e) => e.preventDefault()}>
        {questions.map(({ question }, index) => (
          <div key={index}>
            <div>{question}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>Nie zgadzam się</span>
              {[1, 2, 3, 4, 5, 6].map((value) => (
                <label key={value} style={{ margin: '0 5px' }}>
                  <input
                    type="radio"
                    value={value}
                    checked={responses[index] === value}
                    onChange={() => handleRadioChange(index, value)}
                  />
                </label>
              ))}
              <span>Zgadzam się całkowicie</span>
            </div>
          </div>
        ))}
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </form>
      {result && <div>Result: {result}</div>}
    </div>
  );
}

export default App;
