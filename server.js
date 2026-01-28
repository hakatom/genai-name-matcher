const express = require('express');
const cors = require('cors');
const { compareNames } = require('./src/matcher');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.post('/api/match', (req, res) => {
    try {
        const { name1, name2 } = req.body;
        
        // Validate input
        if (!name1 || !name2) {
            return res.status(400).json({ 
                error: "Both name1 and name2 are required",
                match: false,
                score: 0
            });
        }
        
        console.log(`Matching: "${name1}" vs "${name2}"`);
        const result = compareNames(name1, name2);
        console.log("Result:", result);
        res.json(result);
    } catch (error) {
        console.error("Error matching names:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Export app for testing
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
