// Loads variables from .env into process.env
require('dotenv').config();

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
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// Initialize multer (No disk storage, files are stored in memory, buffer only)
// const upload = multer();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

// Enable HTTP method override for PUT/DELETE via query (_method)
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Redirect root (/) to /about
app.get('/', (req, res) => {
    res.redirect('/about');
});

// Serve home page
app.get('/home', (req, res) => {
    res.render('home');
});

// Serve about page
app.get('/about', (req, res) => {
    res.render('about');
});

// Refactor: Use just getFilteredArticles() across app for consistent, scalable filtering
app.get('/articles', async (req, res) => {
    try {
        const { category_id, minDate, author, search } = req.query;

        const articles = await contentService.getFilteredArticles({ category_id, minDate, author, search });

        const categories = await contentService.getCategories();

        // Get all authors from all published articles (not just filtered ones)
        const allPublished = await contentService.getPublishedArticles();
        const authors = [...new Set(allPublished.map(a => a.author))].sort();

        res.render('articles', {
            articles,
            categories,
            authors,
            error: null,
            query: req.query
        });
    } catch (err) {
        console.error("Error loading articles:", err);
        res.render('articles', {
            articles: [],
            categories: [],
            authors: [],
            error: err,
            query: req.query
        });
    }
});

// Refactored /article/:id
app.get('/article/:id', async (req, res) => {
    try {
        const article = await contentService.getArticleById(req.params.id);

        try {
            article.category_name = await contentService.getCategoryNameById(article.category_id);
        } catch (e) {
            console.error("Error resolving category name:", e);
            article.category_name = 'Unknown';
        }
        
        res.render('article', { article });
    } catch (err) {
        console.error("Error loading article:", err);
        res.status(404).render('404', { message: "Article not found." });
    }
});

// Refactored /categories using DB method
app.get('/categories', async (req, res) => {
    try {
        const categories = await contentService.getCategories();
        res.render('categories', { categories });
    } catch (err) {
        console.error("Error loading categories:", err);
        res.render('categories', { categories: [], error: err });
    }
});

// GET form to add article
app.get('/articles/add', async (req, res) => {
    try {
        const categories = await contentService.getCategories();
        res.render('addArticle', { categories });
    } catch (err) {
        console.error("Error loading categories for addArticle:", err);
        res.render('addArticle', { categories: [], error: "Failed to load categories" });
    }
});

// POST new article (with optional image)
app.post('/articles/add', upload.single("feature_image"), (req, res) => {
    // Debug log for uploaded file
    console.log("Image file received:", req.file);
    if (req.file) {
        console.log("Buffer size:", req.file.buffer?.length || "No buffer");
    }
    
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
        req.body.feature_image = imageUrl;

        // Basic validation
        if (!req.body.title || !req.body.author || !req.body.content) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Call your contentService method to add the article
        contentService.addArticle(req.body)
            .then(() => res.redirect('/articles'))
            .catch(err => {
                console.error("Error adding article:", err);
                res.status(500).json({ message: "Article creation failed", error: err });
            });
    }

    if (req.file) {
        // If image file is present, upload it first
        streamUpload(req)
            .then(uploaded => {
                processArticle(uploaded.url);
            })
            .catch(err => {
                console.error("Cloudinary upload error:", err);
                const errorMessage = err?.message || JSON.stringify(err) || "Unknown error";
                res.status(500).json({ message: "Image upload failed", error: errorMessage });
            });
    } else {
        // No image file uploaded, just process the article without image URL
        processArticle(""); // If no image uploaded, pass an empty string // 沒圖片也能新增
    }
});

// GET form to edit an article
app.get('/article/:id/edit', async (req, res) => {
    try {
        const article = await contentService.getArticleById(req.params.id);
        const categories = await contentService.getCategories();

        res.render('editArticle', {
            article,
            categories,
            error: null
        });
    } catch (err) {
        console.error("Error loading edit form:", err);
        res.status(404).render('404', { message: "Article not found for editing." });
    }
});

// PUT update article
app.put('/article/:id', upload.single("feature_image"), async (req, res) => {
    try {
        const articleId = req.params.id;

        req.body.published = req.body.published ? true : false;

        const updateArticle = async (imageUrl = "") => {
            let finalImageUrl = imageUrl || req.body.existingImage || null;

            if (req.body.removeImage) {
                finalImageUrl = null; // remove image if checkbox is checked
            }

            const updatedData = {
                ...req.body,
                feature_image: finalImageUrl
            };

            await contentService.updateArticle(articleId, updatedData);
            res.redirect(`/article/${articleId}`);
        };

        if (req.file) {
            const uploaded = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) resolve(result);
                    else reject(error);
                });
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
            await updateArticle(uploaded.url);
        } else {
            await updateArticle();
        }
    } catch (err) {
        console.error("Error updating article:", err);
        res.status(500).send("Failed to update article.");
    }
});

// DELETE article
app.delete('/article/:id', async (req, res) => {
    try {
        await contentService.deleteArticle(req.params.id);
        res.redirect('/articles');
    } catch (err) {
        console.error("Error deleting article:", err);
        res.status(500).send("Failed to delete article.");
    }
});

// start the server
app.listen(HTTP_PORT, () => {
    console.log(`Server listening on http://localhost:${HTTP_PORT}`);
});
