const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Helper function to read/write JSON files safely
const readDocs = (file) => {
    const filePath = path.join(__dirname, file);
    try {
        if (!fs.existsSync(filePath)) return [];
        return JSON.parse(fs.readFileSync(filePath));
    } catch (err) {
        console.error(`Error reading ${filePath}:`, err);
        return [];
    }
};

const writeDocs = (file, data) => {
    const filePath = path.join(__dirname, file);
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`Error writing ${filePath}:`, err);
    }
};


app.get('/menu', (req, res) => {
    const menu = readDocs('menu.json');
    res.json(menu);
});

app.get('/cart', (req, res) => {
    const cart = readDocs('cart.json');
    res.json(cart);
});

app.post('/cart', (req, res) => {
    const cart = readDocs('cart.json');
    cart.push(req.body);
    writeDocs('cart.json', cart);
    res.json({ success: true, cart });
});

app.post('/reservation', (req, res) => {
    const reservations = readDocs('reservations.json');
    reservations.push(req.body);
    writeDocs('reservations.json', reservations);
    res.json({ success: true, reservations });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

