import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier, VotingClassifier, AdaBoostClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
from sklearn.metrics import classification_report
import joblib

data = pd.read_csv('Modified_Data_final_with_Polish_Careers.csv')

X = data[['O_score', 'C_score', 'E_score', 'A_score', 'N_score']]
y = data['Career']

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

smote = SMOTE(random_state=42, k_neighbors=2)
X_resampled, y_resampled = smote.fit_resample(X_scaled, y)

X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.1, random_state=42)

models = {
    "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=10, min_samples_split=5, min_samples_leaf=3, random_state=42),
    "Logistic Regression": LogisticRegression(random_state=42),
    "SVC (RBF Kernel)": SVC(kernel='rbf', probability=True, random_state=42),
    "KNN": KNeighborsClassifier(n_neighbors=2),
    "Decision Tree": DecisionTreeClassifier(random_state=42),
}

voting_clf = VotingClassifier(
    estimators=[
        ('dt', models["Decision Tree"]),
        ('rf', models["Random Forest"]),
        ('knn', models["KNN"])
    ],
    voting='soft'
)
models["Voting Classifier"] = voting_clf

for name, model in models.items():
    print(f"Model: {name}")
    scores = cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy')
    print(f"Cross-validated accuracy: {scores.mean():.4f} (+/- {scores.std():.4f})")
    print("-" * 50)

