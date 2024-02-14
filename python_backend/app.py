from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

app = Flask(__name__)
CORS(app)

# Load the dataset
final = pd.read_csv('final.csv')

# Remove rows with negative values
final = final.dropna()  # Drop rows with missing values
final = final[final.ge(0).all(axis=1)]  # Keep rows where all values are non-negative

# Split the data into features (X) and target variable (y)
X = final.drop(['result'], axis=1)
y = final['result']

# Define preprocessing steps
numeric_features = X.select_dtypes(include=['int64', 'float64']).columns
numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='mean')),
    ('scaler', StandardScaler())
])
preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features)
    ])

# Create a pipeline
pipe = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', LogisticRegression(solver='liblinear', max_iter=1000))
])

# Fitting the training data
pipe.fit(X, y)

@app.route('/')
def index():
    sample_data = {
        'runs_left': [2],
        'balls_left': [100],
        'wickets_left': [10],
        'total_runs_x': [208],
        'cur_run_rate': [10.2],
        'req_run_rate': [1]
    }

    # Convert the sample data into a DataFrame
    sample_df = pd.DataFrame(sample_data)

    # Make prediction on the sample data
    prediction = pipe.predict(sample_df)

    # Use predict_proba to get probability estimates
    probability_estimate = pipe.predict_proba(sample_df)
    percentage_prediction = probability_estimate[0][1] * 100  # Percentage of the positive class (1)

    # Return the prediction and percentage as JSON response
    return jsonify({
        'prediction': prediction.tolist(),
        'percentage_prediction': percentage_prediction
    })

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    sample_df = pd.DataFrame([data])  # Wrap data in a list to create DataFrame
    prediction = pipe.predict(sample_df)
    probability_estimate = pipe.predict_proba(sample_df)
    percentage_prediction = probability_estimate[0][1] * 100  # Percentage of the positive class (1)

    # Return the prediction and percentage as JSON response
    return jsonify({
        'prediction': prediction.tolist(),
        'percentage_prediction': percentage_prediction
    })

if __name__ == '__main__':
    app.run(debug=True)
