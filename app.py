import numpy as np
import pickle
import pandas as pd
import warnings
warnings.filterwarnings("ignore")
from flask import Flask, request, render_template

app = Flask(__name__)

# Load the machine learning model
try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
    model_loaded = True
    print("Machine learning model loaded successfully.")
except Exception as e:
    print(f"Warning: Could not load model.pkl ({e}). A physiological heuristic fallback will be used.")
    model = None
    model_loaded = False

@app.route('/')  # Route to display the home page
def home():
    return render_template('index.html')

@app.route('/predict', methods=["POST"])
def predict():
    try:
        # Extract inputs from form post request
        gender = float(request.form["Gender"])
        hemoglobin = float(request.form["Hemoglobin"])
        mch = float(request.form["MCH"])
        mchc = float(request.form["MCHC"])
        mcv = float(request.form["MCV"])
    except (KeyError, ValueError) as e:
        return render_template("index.html", error_text="Please fill out all fields with valid numbers.")

    # Prepare features for the ML model
    features_values = np.array([[gender, hemoglobin, mch, mchc, mcv]])  # reshape to 2D array
    df = pd.DataFrame(features_values, columns=['Gender', 'Hemoglobin', 'MCH', 'MCHC', 'MCV'])

    is_anemic = 0
    
    if model_loaded and model is not None:
        try:
            prediction = model.predict(df)
            is_anemic = int(prediction[0])
            if is_anemic == 0:
                result_text = "You don't have any Anemic Disease"
            else:
                result_text = "You have anemic disease"
        except Exception as e:
            print(f"Prediction error: {e}. Falling back to clinical heuristics.")
            # Fallback to standard WHO clinical diagnostic guidelines
            # Hemoglobin < 13.0 g/dL for adult males, < 12.0 g/dL for non-pregnant adult females
            if gender == 0.0:  # Male
                is_anemic = 1 if hemoglobin < 13.0 else 0
            else:  # Female
                is_anemic = 1 if hemoglobin < 12.0 else 0
            result_text = "You have anemic disease" if is_anemic else "You don't have any Anemic Disease"
    else:
        # Fallback to standard WHO clinical diagnostic guidelines
        if gender == 0.0:  # Male
            is_anemic = 1 if hemoglobin < 13.0 else 0
        else:  # Female
            is_anemic = 1 if hemoglobin < 12.0 else 0
        result_text = "You have anemic disease" if is_anemic else "You don't have any Anemic Disease"

    return render_template(
        "predict.html",
        prediction_text=result_text,
        is_anemic=is_anemic,
        gender=gender,
        hemoglobin=hemoglobin,
        mch=mch,
        mchc=mchc,
        mcv=mcv
    )

if __name__ == "__main__":
    app.run(debug=True)
