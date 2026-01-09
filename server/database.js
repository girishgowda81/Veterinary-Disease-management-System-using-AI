const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'vet_system.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Diseases Table
        db.run(`CREATE TABLE IF NOT EXISTS diseases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            severity TEXT,
            description TEXT
        )`);

        // Treatments Table
        db.run(`CREATE TABLE IF NOT EXISTS treatments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            disease_id INTEGER,
            treatment_text TEXT,
            type TEXT,
            FOREIGN KEY (disease_id) REFERENCES diseases (id)
        )`);

        // Predictions Table
        db.run(`CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            predicted_disease_id INTEGER,
            confidence REAL,
            input_type TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (predicted_disease_id) REFERENCES diseases (id)
        )`);

        seedData();
    });
}

function seedData() {
    db.get("SELECT count(*) as count FROM diseases", (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        if (row.count === 0) {
            console.log("Seeding data...");
            
            // Disease 1: Foot and Mouth Disease
            db.run(`INSERT INTO diseases (name, severity, description) VALUES (?, ?, ?)`, 
                ['Foot and Mouth Disease', 'High', 'A severe, highly contagious viral disease of livestock.'], function(err) {
                    if (err) return console.error(err.message);
                    const diseaseId = this.lastID;
                    
                    db.run(`INSERT INTO treatments (disease_id, treatment_text, type) VALUES (?, ?, ?)`, [diseaseId, 'Isolate the infected animal immediately.', 'Home Care']);
                    db.run(`INSERT INTO treatments (disease_id, treatment_text, type) VALUES (?, ?, ?)`, [diseaseId, 'Administer NSAIDs for pain relief (Consult Vet).', 'Medication']);
                    db.run(`INSERT INTO treatments (disease_id, treatment_text, type) VALUES (?, ?, ?)`, [diseaseId, 'Contact specific veterinary authorities for reporting.', 'Vet Required']);
                }
            );

            // Disease 2: Mastitis
            db.run(`INSERT INTO diseases (name, severity, description) VALUES (?, ?, ?)`, 
                ['Mastitis', 'Medium', 'Inflammation of the mammary gland/udder, usually due to bacterial infection.'], function(err) {
                    if (err) return console.error(err.message);
                    const diseaseId = this.lastID;

                    db.run(`INSERT INTO treatments (disease_id, treatment_text, type) VALUES (?, ?, ?)`, [diseaseId, 'Clean teats with antiseptic before and after milking.', 'Home Care']);
                    db.run(`INSERT INTO treatments (disease_id, treatment_text, type) VALUES (?, ?, ?)`, [diseaseId, 'Antibiotic therapy (Intramammary infusion).', 'Medication']);
                }
            );
            
             // Disease 3: Normal / Healthy
             db.run(`INSERT INTO diseases (name, severity, description) VALUES (?, ?, ?)`,
                ['Healthy', 'Low', 'No signs of disease detected.'], function(err) {
                    if (err) return console.error(err.message);
                    const diseaseId = this.lastID;
                    db.run(`INSERT INTO treatments (disease_id, treatment_text, type) VALUES (?, ?, ?)`, [diseaseId, 'Maintain regular hygiene and balanced diet.', 'Home Care']);
                }
             );

        } else {
            console.log("Database already seeded.");
        }
    });
}

module.exports = db;
