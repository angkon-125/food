const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/menu', (req, res) => {
    const menu = JSON.parse(fs.readFileSync('menu.json'));
    res.json(menu);
});

app.get('/cart', (req, res) => {
    const cart = JSON.parse(fs.readFileSync('cart.json'));
    res.json(cart);
});

app.post('/cart', (req, res) => {
    const cart = JSON.parse(fs.readFileSync('cart.json'));
    cart.push(req.body);
    fs.writeFileSync('cart.json', JSON.stringify(cart, null, 2));
    res.json({ success: true, cart });
});

app.post('/reservation', (req, res) => {
    const reservations = JSON.parse(fs.readFileSync('reservations.json'));
    reservations.push(req.body);
    fs.writeFileSync('reservations.json', JSON.stringify(reservations, null, 2));
    res.json({ success: true, reservations });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
