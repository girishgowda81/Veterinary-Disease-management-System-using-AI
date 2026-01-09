const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { predictDisease } = require('./services/aiService');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// API Routes

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Predict Disease
app.post('/api/predict', upload.single('image'), async (req, res) => {
    try {
        const symptoms = req.body.symptoms;
        const imageBuffer = req.file ? req.file.buffer : null;

        if (!symptoms && !imageBuffer) {
            return res.status(400).json({ error: 'Please provide symptoms or an image.' });
        }

        const result = await predictDisease(symptoms, imageBuffer);
        res.json(result);

    } catch (error) {
        console.error('Prediction error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get Treatment history (optional, or specific lookup)
app.get('/api/treatments/:predictionId', (req, res) => {
    // This could return details stored for a specific prediction ID if needed
    // For now, the predict endpoint returns everything.
    res.json({ message: "Treatment details already returned in prediction." });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
