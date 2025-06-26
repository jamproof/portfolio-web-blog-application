// Get the express module
const express = require('express');

// Built-in Node module for working with file and directory paths
const path = require('path');

// Import the content service module
const contentService = require('./content-service');

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

// // Serve articles.html on /articles route
// app.get('/articles', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'articles.html'));
// });

// Route to get published articles as JSON
app.get('/articles', (req, res) => {
    contentService.getPublishedArticles()
        .then(data => res.json(data))
        .catch(err => res.status(404).json({ message: err }));
});

// // Serve categories.html on /categories route
// app.get('/categories', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'categories.html'));
// });

// Route to get categories as JSON
app.get('/categories', (req, res) => {
    contentService.getCategories()
        .then(data => res.json(data))
        .catch(err => res.status(404).json({ message: err }));
});

// Initialize content service and start the server
contentService.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server listening on http://localhost:${HTTP_PORT}`);
        });
    })
    .catch(err => {
        console.error("Failed to initialize content service:", err);
    });
