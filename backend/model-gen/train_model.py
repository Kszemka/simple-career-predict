import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier  # Zmieniono z RandomForestClassifier na KNeighborsClassifier
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler
import joblib

data = pd.read_csv('Modified_Data_final_with_Polish_Careers.csv')

X = data[['O_score', 'C_score', 'E_score', 'A_score', 'N_score']]
y = data['Career']

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.1, random_state=42)

model = KNeighborsClassifier(n_neighbors=2)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

joblib.dump(model, 'personality_career_knn_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
