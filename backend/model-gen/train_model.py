import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from tensorflow import keras
from tensorflow.keras import layers
import joblib
from tensorflow.python.keras.callbacks import EarlyStopping

data = pd.read_csv('Modified_Data_final_with_Polish_Careers.csv')

X = data[['O_score', 'C_score', 'E_score', 'A_score', 'N_score']]
y = data['Career']

label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train_encoded, y_test_encoded = train_test_split(X_scaled, y_encoded, test_size=0.1,random_state=42, shuffle=True)

num_classes = len(np.unique(y_encoded))

y_train = keras.utils.to_categorical(y_train_encoded, num_classes=num_classes)
y_test = keras.utils.to_categorical(y_test_encoded, num_classes=num_classes)

model = keras.Sequential([
    layers.Dense(64, activation='relu'),
    layers.Dense(num_classes, activation='softmax')
])

model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])
es = EarlyStopping(monitor='val_loss', mode='min', verbose=1, patience=4, restore_best_weights=True)

model.fit(X_train, y_train, epochs=400,callbacks=[es],validation_split=0.1)

loss, accuracy = model.evaluate(X_test, y_test)
print(f"Accuracy: {accuracy:.4f}")
print(f"Loss: {loss:.4f}")

model.save('personality_career_model_nn.keras')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(label_encoder, 'label_encoder.pkl')
