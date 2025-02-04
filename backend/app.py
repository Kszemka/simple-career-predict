from flask import Flask, request, jsonify
import pandas as pd
import joblib

app = Flask(__name__)

model = joblib.load('model-gen/personality_career_knn_model.pkl')
scaler = joblib.load('model-gen/scaler-knn.pkl')

def calculate_personality_scores(responses):
    """
    Calculate the average personality scores based on user responses.
    `responses` should be a dictionary where keys are category names
    and values are lists of responses (integers from 1 to 5).

    Returns a dictionary with personality scores scaled to 1-10 range.
    """
    personality_scores = {}
    for category, scores in responses.items():
        if scores:
            average_score = sum(scores) / len(scores)
            scaled_score = (average_score - 1) * (10 - 1) / (5 - 1) + 1
            personality_scores[category] = round(scaled_score, 2)
    return personality_scores

def predict_career(personality_scores):
    """
    Predict career based on personality scores.
    `personality_scores` is a dictionary with scores for each personality trait.
    """
    input_features = pd.DataFrame([personality_scores], columns=personality_scores.keys())
    input_scaled = scaler.transform(input_features)
    predicted_career = model.predict(input_scaled)
    return predicted_career[0]

@app.route('/submit_scores', methods=['POST'])
def submit():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    personality_scores = calculate_personality_scores(data)
    
    predicted_career = predict_career(personality_scores)

    return jsonify({'predicted_career': predicted_career}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
