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

// // Configure Cloudinary
// cloudinary.config({
//     cloud_name: 'dl6asgowz',
//     api_key: '291149542995368',
//     api_secret: '4wCpwkwO06RawSeDTngnZz-6_yg',
//     secure: true
// });

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
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

// // Refactored /articles using DB methods (content-service.js)
// app.get('/articles', async (req, res) => {
//     try {
//         const { category_id, minDate, author, search } = req.query;

//         let articles = [];

//         if (category_id) {
//             articles = await contentService.getArticlesByCategory(category_id);
//         } else if (minDate) {
//             articles = await contentService.getArticlesByMinDate(minDate);
//         } else if (author) {
//             articles = await contentService.getArticlesByAuthor(author);
//         } else {
//             articles = await contentService.getPublishedArticles();
//         }

//         // Apply keyword search in-memory as it's not supported by SQL query
//         if (search) {
//             const keyword = search.toLowerCase();
//             articles = articles.filter(a =>
//                 (a.title && a.title.toLowerCase().includes(keyword)) ||
//                 (a.content && a.content.toLowerCase().includes(keyword))
//             );
//         }

//         const categories = await contentService.getCategories();

//         // Get all published articles to extract unique authors
//         const allPublished = await contentService.getPublishedArticles();
//         const authors = [...new Set(allPublished.map(a => a.author))].sort();

//         res.render('articles', {
//             articles,
//             categories,
//             authors,
//             error: null,
//             query: req.query
//         });
//     } catch (err) {
//         console.error("Error loading articles:", err);
//         res.render('articles', {
//             articles: [],
//             categories: [],
//             authors: [],
//             error: err,
//             query: req.query
//         });
//     }
// });

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
        
        // article.category_name = await contentService.getCategoryNameById(article.category_id);

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
                res.status(500).json({ message: "Image upload failed", error: err });
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
            updateArticle(uploaded.url);
        } else {
            updateArticle();
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



/*
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

// // Route to get all articles or filtered articles (Return published articles only)
// app.get('/articles', (req, res) => {
//     if (req.query.category_id) {
//         contentService.getArticlesByCategory(req.query.category_id)
//             .then(data => res.json(data))
//             .catch(err => res.status(404).json({ message: err }));
//     } else if (req.query.minDate) {
//         contentService.getArticlesByMinDate(req.query.minDate)
//             .then(data => res.json(data))
//             .catch(err => res.status(404).json({ message: err }));
//     } else {
//         contentService.getPublishedArticles()
//             .then(data => res.json(data))
//             .catch(err => res.status(404).json({ message: err }));
//     }
// });

app.get('/articles', async (req, res) => {
    try {
        const { category_id, minDate, author, search } = req.query;

        let articles = await contentService.getPublishedArticles();

        // Apply filters in sequence
        if (category_id) {
            articles = articles.filter(a => a.category_id === parseInt(category_id));
        }
        if (minDate) {
            articles = articles.filter(a => new Date(a.published_date) >= new Date(minDate));
        }
        if (author) {
            articles = articles.filter(a => a.author.toLowerCase().includes(author.toLowerCase()));
        }
        if (search) {
            const keyword = search.toLowerCase();
            articles = articles.filter(a =>
                (a.title && a.title.toLowerCase().includes(keyword)) ||
                (a.content && a.content.toLowerCase().includes(keyword))
            );
        }

        const categories = await contentService.getCategories();

        // Get all published articles to extract unique authors
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
        let authors = [];
        try {
            const allPublished = await contentService.getPublishedArticles();
            authors = [...new Set(allPublished.map(a => a.author))].sort();
        } catch (e) {
            console.error("Failed to load authors for fallback:", e);
        }

        res.render('articles', {
            articles: [],
            categories: [],
            authors: [],
            error: err,
            query: req.query
        });
    }
});

// // Route to get an article by ID (Return published articles only)
// app.get('/article/:id', (req, res) => {
//     contentService.getArticleById(req.params.id)
//         .then(data => res.json(data))
//         .catch(err => res.status(404).json({ message: err }));
// });

app.get('/article/:id', async (req, res) => {
    try {
        const article = await contentService.getArticleById(req.params.id);

        if (!article.published) {
            return res.status(404).render('404', { message: "Article not found." });
        }

        article.category_name = contentService.getCategoryNameById(article.category_id);

        res.render('article', { article });
    } catch (err) {
        res.status(404).render('404', { message: "Article not found." });
    }
});

// // Serve categories.html on /categories route
// app.get('/categories', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'categories.html'));
// });

// // Route to get categories as JSON
// app.get('/categories', (req, res) => {
//     contentService.getCategories()
//         .then(data => res.json(data))
//         .catch(err => res.status(404).json({ message: err }));
// });

app.get('/categories', (req, res) => {
    contentService.getCategories()
      .then(categories => {
        res.render('categories', { categories });
      })
      .catch(err => {
        res.render('categories', { categories: [], error: err });
      });
  });  

// // Route to serve the addArticle.html form
// app.get('/articles/add', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'addArticle.html'));
// });

// // Serve add article page
// app.get('/articles/add', (req, res) => {
//     res.render('addArticle');
// });

app.get('/articles/add', async (req, res) => {
    try {
        const categories = await contentService.getCategories();
        res.render('addArticle', { categories });
    } catch (err) {
        res.render('addArticle', { categories: [], error: "Failed to load categories" });
    }
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
*/
