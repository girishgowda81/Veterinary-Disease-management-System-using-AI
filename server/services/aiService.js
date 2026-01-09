const natural = require('natural');
const db = require('../database');

// Initialize Classifier
const classifier = new natural.BayesClassifier();

// Train the Model (In a real app, this might be loaded from a file)
console.log("Training AI Model...");

// FMD Training Data (English, Hindi, Kannada terms)
classifier.addDocument('blisters on mouth and feet', 'Foot and Mouth Disease');
classifier.addDocument('high fever and foaming', 'Foot and Mouth Disease');
classifier.addDocument('excessive salivation', 'Foot and Mouth Disease');
classifier.addDocument('lameness and limping', 'Foot and Mouth Disease');
classifier.addDocument('bukhar aur muh mein chaale', 'Foot and Mouth Disease'); // Hindi
classifier.addDocument('jwar', 'Foot and Mouth Disease'); // Hindi
classifier.addDocument('baiyalli gulle', 'Foot and Mouth Disease'); // Kannada (Mouth blisters)
classifier.addDocument('jvara', 'Foot and Mouth Disease'); // Kannada

// Mastitis Training Data
classifier.addDocument('swollen udder', 'Mastitis');
classifier.addDocument('painful teats', 'Mastitis');
classifier.addDocument('blood in milk', 'Mastitis');
classifier.addDocument('watery milk', 'Mastitis');
classifier.addDocument('sujan', 'Mastitis'); // Hindi
classifier.addDocument('than mein dard', 'Mastitis'); // Hindi
classifier.addDocument('bav', 'Mastitis'); // Kannada
classifier.addDocument('haalu', 'Mastitis'); // Kannada (Milk related)

// Healthy/Normal
classifier.addDocument('eating well', 'Healthy');
classifier.addDocument('normal behavior', 'Healthy');
classifier.addDocument('active and grazing', 'Healthy');
classifier.addDocument('just checking', 'Healthy');
classifier.addDocument('thiik hai', 'Healthy'); // Hindi

classifier.train();
console.log("AI Model Trained Successfully.");

function predictDisease(symptoms, imageBuffer) {
    return new Promise((resolve, reject) => {

        let predictedDiseaseName = "Healthy";
        let confidence = 0.0;
        let treatments = [];

        // 1. Image Priority (Simulation)
        // If image is present and NO text, we simulate a random check or specific image logic
        if (imageBuffer && (!symptoms || symptoms.trim().length === 0)) {
            // Mock Image Classification
            if (Math.random() > 0.5) {
                predictedDiseaseName = 'Foot and Mouth Disease';
                confidence = 0.75;
            } else {
                predictedDiseaseName = 'Mastitis';
                confidence = 0.82;
            }
        }
        // 2. Text Classification (NLP)
        else if (symptoms) {
            const result = classifier.getClassifications(symptoms.toLowerCase());
            // Result is an array like [{ label: 'FMD', value: 0.002 }, ...]

            // Get top result
            const topResult = result[0];
            predictedDiseaseName = topResult.label;

            // Normalize confidence (BayesClassifier values are small probabilities, we scale for UI)
            // This is a rough heuristic for UI display purposes
            confidence = 0.85 + (topResult.value * 1000);
            if (confidence > 0.99) confidence = 0.99;
            if (confidence < 0.60) confidence = 0.60;

            console.log(`[NLP Engine] Input: "${symptoms}" | Predicted: ${predictedDiseaseName} | Raw Score: ${topResult.value}`);
        }

        // Fetch details from DB
        db.get("SELECT * FROM diseases WHERE name = ?", [predictedDiseaseName], (err, disease) => {
            if (err) return reject(err);
            if (!disease) return reject(new Error("Disease not found in DB"));

            // Log prediction
            const stmt = db.prepare("INSERT INTO predictions (predicted_disease_id, confidence, input_type) VALUES (?, ?, ?)");
            const inputType = imageBuffer ? 'Image + Text' : 'Text Only';
            stmt.run(disease.id, confidence, inputType, function (err) {
                if (err) console.error("Error logging prediction", err);

                // Fetch treatments
                db.all("SELECT * FROM treatments WHERE disease_id = ?", [disease.id], (err, rowTreatments) => {
                    if (err) return reject(err);

                    resolve({
                        disease: disease,
                        confidence: confidence,
                        treatments: rowTreatments,
                        predictionId: this.lastID
                    });
                });
            });
            stmt.finalize();
        });
    });
}

module.exports = { predictDisease };
