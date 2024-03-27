from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import GridSearchCV

app = Flask(__name__)
CORS(app)

# Load the dataset
final = pd.read_csv('final.csv')

# Remove rows with negative values
# final = final.dropna()  # Drop rows with missing values
# final = final[final.ge(0).all(axis=1)]  # Keep rows where all values are non-negative

# Split the data into features (X) and target variable (y)
X = final.drop(['result'], axis=1)
y = final['result']

# Define preprocessing steps
pipe = Pipeline(steps=[
    ('classifier', LogisticRegression(solver='liblinear', max_iter=1000))
])

# Define hyperparameters grid for grid search
param_grid = {
    'classifier__C': [0.001, 0.01, 0.1, 1, 10, 100]  # Regularization parameter
}

# Perform grid search with cross-validation to find the best hyperparameters
grid_search = GridSearchCV(pipe, param_grid, cv=5, scoring='accuracy')
grid_search.fit(X, y)

# Get the best hyperparameters and print the results
best_params = grid_search.best_params_
best_score = grid_search.best_score_
print("Best Hyperparameters:", best_params)
print("Best Training Accuracy:", best_score)
@app.route('/', methods=['GET'])
def index():
    sample_data = {
        'runs_left': 18,
        'balls_left': 198,
        'wickets_left': 10,
        'total_runs_x': [200],
        'cur_run_rate': [10.2],
        'req_run_rate': [7]
    }
    # print(sample_data)
    # Convert the sample data into a DataFrame
    sample_df = pd.DataFrame(sample_data)

    # Make prediction on the sample data
    best_estimator = grid_search.best_estimator_

    prediction = best_estimator.predict(sample_df)
    probability_estimate = best_estimator.predict_proba(sample_df)
    percentage_prediction = probability_estimate[0][1] * 100  # Perce # Percentage of the positive class (1)

    # Return the prediction and percentage as JSON response
    return jsonify({
        'prediction': prediction.tolist(),
        'percentage_prediction': percentage_prediction
    })

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    # print([data])
    sample_df = pd.DataFrame([data])  # Wrap data in a list to create DataFrame
    best_estimator = grid_search.best_estimator_

    prediction = best_estimator.predict(sample_df)
    probability_estimate = best_estimator.predict_proba(sample_df)
    percentage_prediction = probability_estimate[0][1] * 100  # Perce # Percentage of the positive class (1)

    # Return the prediction and percentage as JSON response
    return jsonify({
        'prediction': prediction.tolist(),
        'percentage_prediction': percentage_prediction
    })

if __name__ == '__main__':
    app.run(debug=True)
