// Get the express module
const express = require('express');

// Built-in Node module for working with file and directory paths
const path = require('path');

// Create an Express app
const app = express();

// Assign a port
const HTTP_PORT = process.env.PORT || 2025;

// Serve static assets from /public directory
app.use(express.static(path.join(__dirname, 'public')));

// Redirect root (/) to /about
app.get('/', (req, res) => {
    res.redirect('/about');
});

// Serve home.html on /home route
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/home.html'));
});

// Serve about.html on /about route
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));
});

// Start the server
app.listen(HTTP_PORT, () => console.log(`server listening on http://localhost:${HTTP_PORT}`))
