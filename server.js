const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8080;

// Path to the views.json file where we will store the view count
const viewsFilePath = path.join(__dirname, 'views.json');

// Middleware to serve static files
app.use(express.static(path.join(__dirname)));

// Get the view count from the JSON file
function getViewCount() {
    if (fs.existsSync(viewsFilePath)) {
        const data = fs.readFileSync(viewsFilePath);
        const viewsData = JSON.parse(data);
        return viewsData.views;
    } else {
        return 0;
    }
}

// Increment the view count and update the JSON file
function incrementViewCount() {
    const currentViews = getViewCount();
    const newViewCount = currentViews + 1;
    const viewsData = { views: newViewCount };

    fs.writeFileSync(viewsFilePath, JSON.stringify(viewsData, null, 2));
}

// Serve the index page and update the view count
app.get('/', (req, res) => {
    incrementViewCount();  // Increment the view count
    res.sendFile(path.join(__dirname, 'index.html'));  // Send the main portfolio page
});

// You can define more routes like for the electrical and IT pages
app.get('/electrical', (req, res) => {
    incrementViewCount();
    res.sendFile(path.join(__dirname, 'electrical.html'));
});

app.get('/it', (req, res) => {
    incrementViewCount();
    res.sendFile(path.join(__dirname, 'it.html'));
});

// Endpoint to get the current view count
app.get('/views', (req, res) => {
    const views = getViewCount();
    res.json({ views });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
