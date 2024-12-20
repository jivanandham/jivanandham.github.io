const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/electrical', (req, res) => {
    res.sendFile(path.join(__dirname, 'electrical.html'));
});

app.get('/it', (req, res) => {
    res.sendFile(path.join(__dirname, 'it.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
