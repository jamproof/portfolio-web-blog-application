// Get the express module
const express = require('express');

// Built-in Node module for working with file and directory paths
const path = require('path');

// Import the content service module
const contentService = require('./content-service');

// File upload and cloud storage
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dl6asgowz',
    api_key: '291149542995368',
    api_secret: '4wCpwkwO06RawSeDTngnZz-6_yg',
    secure: true
});

// Initialize multer (No disk storage, files are stored in memory, buffer only)
const upload = multer();

// Create an Express app
const app = express();

// Assign a port
const HTTP_PORT = process.env.PORT || 2025;

// Set EJS as the template engine
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Serve static assets from /public directory
app.use(express.static(path.join(__dirname, 'public')));

// Allows access to form text fields via req.body
app.use(express.urlencoded({ extended: true }));

// Redirect root (/) to /about
app.get('/', (req, res) => {
    res.redirect('/about');
});

// // Serve home.html on /home route
// app.get('/home', (req, res) => {
//     res.sendFile(path.join(__dirname, '/views/home.html'));
// });

// Serve home page
app.get('/home', (req, res) => {
    res.render('home');
});

// // Serve about.html on /about route
// app.get('/about', (req, res) => {
//     res.sendFile(path.join(__dirname, '/views/about.html'));
// });

// Serve about page
app.get('/about', (req, res) => {
    res.render('about');
});

// // Serve articles.html on /articles route
// app.get('/articles', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'articles.html'));
// });

// // Route to get published articles as JSON
// app.get('/articles', (req, res) => {
//     contentService.getPublishedArticles()
//         .then(data => res.json(data))
//         .catch(err => res.status(404).json({ message: err }));
// });

// Route to get all articles or filtered articles (Return published articles only)
app.get('/articles', (req, res) => {
    if (req.query.category_id) {
        contentService.getArticlesByCategory(req.query.category_id)
            .then(data => res.json(data))
            .catch(err => res.status(404).json({ message: err }));
    } else if (req.query.minDate) {
        contentService.getArticlesByMinDate(req.query.minDate)
            .then(data => res.json(data))
            .catch(err => res.status(404).json({ message: err }));
    } else {
        contentService.getPublishedArticles()
            .then(data => res.json(data))
            .catch(err => res.status(404).json({ message: err }));
    }
});

// Route to get an article by ID (Return published articles only)
app.get('/article/:id', (req, res) => {
    contentService.getArticleById(req.params.id)
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

// // Route to serve the addArticle.html form
// app.get('/articles/add', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'addArticle.html'));
// });

// Serve add article page
app.get('/articles/add', (req, res) => {
    res.render('addArticle');
});

// Route to add an article with an image
app.post('/articles/add', upload.single("featureImage"), (req, res) => {
    // Helper function to upload image to Cloudinary using a stream
    const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (result) resolve(result); // Resolve the promise with the upload result
                    else reject(error); // Reject if there's an error
                }
            );
            // Convert the buffer into a readable stream and pipe it to Cloudinary
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };

    // Function to process the article after image upload // 加入文章資料（含圖片 URL）
    function processArticle(imageUrl = "") {
        req.body.featureImage = imageUrl;

        // Call your contentService method to add the article
        contentService.addArticle(req.body)
            .then(() => res.redirect('/articles'))
            .catch(err => res.status(500).json({ message: "Article creation failed", error: err }));
    }

    if (req.file) {
        // If image file is present, upload it first
        streamUpload(req)
            .then(uploaded => {
                processArticle(uploaded.url);
            })
            .catch(err => {
                console.error("Cloudinary upload error:", err);
                res.status(500).json({ message: "Image upload failed", error: err });
            });
    } else {
        // No image file uploaded, just process the article without image URL
        processArticle(""); // If no image uploaded, pass an empty string // 沒圖片也能新增
    }
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
