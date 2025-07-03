require('dotenv').config(); // Load environment variables
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// const pool = new Pool({
//     user: 'neondb_owner',
//     host: 'ep-calm-butterfly-a5232477-pooler.us-east-2.aws.neon.tech',
//     database: 'blog_database',
//     password: 'npg_kRGh1rPjt7bE',
//     port: 5432,
//     ssl: {
//         rejectUnauthorized: false,
//     },
// });

// Get all categories
function getCategories() {
    return pool.query(`SELECT * FROM categories`)
        .then(res => res.rows)
        .catch(() => Promise.reject("No categories found."));
        // .catch(err => Promise.reject("Failed to load categories: " + err.message));
}

// Get published articles with category names
async function getPublishedArticles() {
    try {
        const query = `
            SELECT a.*, c.name AS category_name
            FROM articles a
            JOIN categories c ON a.category_id = c.id
            WHERE a.published = true
            ORDER BY a.published_date DESC
        `;
        const result = await pool.query(query);
        if (result.rows.length > 0) return result.rows;
        else throw "No published articles found.";
    } catch (err) {
        return Promise.reject(err);
    }
}

// Add a new article
function addArticle(articleData) {
    const {
        title,
        author,
        category_id,
        published_date,
        content,
        published = false,
        feature_image = null
    } = articleData;

    const query = `
        INSERT INTO articles (title, author, category_id, published_date, content, published, feature_image)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;

    const values = [title, author, parseInt(category_id), published_date, content, published, feature_image];

    return pool.query(query, values)
        .then(res => res.rows[0])
        .catch(err => Promise.reject("Failed to add article: " + err.message));
}

// // Get articles by category ID (published only)
// function getArticlesByCategory(categoryId) {
//     const query = `
//         SELECT a.*, c.name AS category_name
//         FROM articles a
//         JOIN categories c ON a.category_id = c.id
//         WHERE a.category_id = $1 AND a.published = true
//     `;
//     return pool.query(query, [parseInt(categoryId)])
//         .then(res => res.rows.length ? res.rows : Promise.reject("No articles found for this category"))
//         .catch(err => Promise.reject(err.message));
// }

// // Get articles published after a certain date
// function getArticlesByMinDate(minDateStr) {
//     const query = `
//         SELECT a.*, c.name AS category_name
//         FROM articles a
//         JOIN categories c ON a.category_id = c.id
//         WHERE a.published = true AND a.published_date >= $1
//     `;
//     return pool.query(query, [minDateStr])
//         .then(res => res.rows.length ? res.rows : Promise.reject("No articles published after that date"))
//         .catch(err => Promise.reject(err.message));
// }

// // Get articles by author (partial match, published only)
// function getArticlesByAuthor(authorName) {
//     const query = `
//         SELECT a.*, c.name AS category_name
//         FROM articles a
//         JOIN categories c ON a.category_id = c.id
//         WHERE a.published = true AND LOWER(a.author) LIKE LOWER($1)
//     `;
//     return pool.query(query, [`%${authorName}%`])
//         .then(res => res.rows.length ? res.rows : Promise.reject("No articles found for this author"))
//         .catch(err => Promise.reject(err.message));
// }

// Refactor all three getArticlesBy* methods together. 
// Creating a universal getFilteredArticles() for scalability, simplify logic, 
// reduce repetition, and make future filtering (e.g., pagination, tag filters) easier to implement.
async function getFilteredArticles({ category_id, minDate, author, search }) {
    try {
        let baseQuery = `
            SELECT a.*, c.name AS category_name
            FROM articles a
            JOIN categories c ON a.category_id = c.id
            WHERE a.published = true
        `;

        const params = [];
        let idx = 1;

        if (category_id) {
            baseQuery += ` AND a.category_id = $${idx++}`;
            params.push(parseInt(category_id));
        }

        if (minDate) {
            baseQuery += ` AND a.published_date >= $${idx++}`;
            params.push(minDate);
        }

        if (author) {
            baseQuery += ` AND LOWER(a.author) LIKE LOWER($${idx++})`;
            params.push(`%${author}%`);
        }

        baseQuery += ` ORDER BY a.published_date DESC`;

        const result = await pool.query(baseQuery, params);
        let articles = result.rows;

        // Apply keyword search in memory if necessary
        if (search) {
            const keyword = search.toLowerCase();
            articles = articles.filter(article =>
                (article.title && article.title.toLowerCase().includes(keyword)) ||
                (article.content && article.content.toLowerCase().includes(keyword))
            );
        }

        return articles;
    } catch (err) {
        return Promise.reject("Failed to fetch filtered articles: " + err.message);
    }
}

// Get a single published article by ID
function getArticleById(id) {
    const query = `
        SELECT *
        FROM articles
        WHERE id = $1 AND published = true
    `;
    return pool.query(query, [parseInt(id)])
        .then(res => res.rows.length ? res.rows[0] : Promise.reject("No articles available."))
        .catch(err => Promise.reject(err.message));
}

// // Get a single article by ID (published OR unpublished)
// // Don't use at this moment. It have to implement `getAllArticles` Function
// // Can't edit unpublished article right now
// function getArticleById(id) {
//     const query = `
//         SELECT *
//         FROM articles
//         WHERE id = $1
//     `;
//     return pool.query(query, [parseInt(id)])
//         .then(res => res.rows.length ? res.rows[0] : Promise.reject("No articles available."))
//         .catch(err => Promise.reject(err.message));
// }

// Get category name by ID (helper)
function getCategoryNameById(id) {
    const query = `SELECT name FROM categories WHERE id = $1`;
    return pool.query(query, [parseInt(id)])
        .then(res => res.rows.length ? res.rows[0].name : 'Unknown')
        .catch(() => 'Unknown');
}

// Update an article by ID
function updateArticle(id, articleData) {
    const {
        title,
        author,
        category_id,
        published_date,
        content,
        published = false,
        feature_image = null
    } = articleData;

    const query = `
        UPDATE articles
        SET title = $1,
            author = $2,
            category_id = $3,
            published_date = $4,
            content = $5,
            published = $6,
            feature_image = $7
        WHERE id = $8
        RETURNING *
    `;

    const values = [title, author, parseInt(category_id), published_date, content, published, feature_image, parseInt(id)];

    return pool.query(query, values)
        .then(res => res.rows.length ? res.rows[0] : Promise.reject("Article not found for update"))
        .catch(err => Promise.reject("Failed to update article: " + err.message));
}

// Delete an article by ID
function deleteArticle(id) {
    return pool.query(`DELETE FROM articles WHERE id = $1 RETURNING *`, [parseInt(id)])
        .then(res => res.rows.length ? res.rows[0] : Promise.reject("Article not found for deletion"))
        .catch(err => Promise.reject("Failed to delete article: " + err.message));
}

// Export all DB-backed functions
module.exports = {
    getCategories,
    getPublishedArticles,
    addArticle,
    // getArticlesByCategory,
    // getArticlesByMinDate,
    // getArticlesByAuthor,
    getFilteredArticles,
    getArticleById,
    getCategoryNameById,
    updateArticle,
    deleteArticle
};



/*
const fs = require('fs').promises;
const path = require('path');

// Global arrays
let articles = [];
let categories = [];

// Load JSON files asynchronously
function initialize() {
    return new Promise(async (resolve, reject) => {
        try {
            const articlesData = await fs.readFile(path.join(__dirname, 'data', 'articles.json'), 'utf8');
            const categoriesData = await fs.readFile(path.join(__dirname, 'data', 'categories.json'), 'utf8');

            articles = JSON.parse(articlesData);
            categories = JSON.parse(categoriesData);

            resolve();
        } catch (err) {
            reject(`Initialization failed: ${err}`);
        }
    });
}

// // Return published articles only
// function getPublishedArticles() {
//     return new Promise((resolve, reject) => {
//         const published = articles.filter(article => article.published === true);
//         if (published.length > 0) {
//             resolve(published);
//         } else {
//             reject("No published articles found.");
//         }
//     });
// }

function getPublishedArticles() {
    return new Promise((resolve, reject) => {
        const published = articles
            .filter(article => article.published === true)
            .map(article => ({
                ...article,
                category_name: getCategoryNameById(article.category_id)
            }));
        if (published.length > 0) {
            resolve(published);
        } else {
            reject("No published articles found.");
        }
    });
}

// Return all articles
function getAllArticles() {
    return new Promise((resolve, reject) => {
        if (articles.length > 0) {
            resolve(articles);
        } else {
            reject("No articles found.");
        }
    });
}

// Return all categories
function getCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length > 0) {
            resolve(categories);
        } else {
            reject("No categories found.");
        }
    });
}

// Add a new article
function addArticle(articleData) {
    return new Promise((resolve, reject) => {
        articleData.published = articleData.published ? true : false;
        // When multiple people are added articles at the same time, there will be a problem of duplicate IDs.
        // articleData.id = articles.length + 1;
        // 若用 JSON 存資料時同時刪除某筆文章，可能導致 ID 重複。可使用 Date.now() 或 UUID 來確保唯一性。

        // Generate a unique ID based on the current max ID in the articles array
        articleData.id = articles.length > 0
            ? Math.max(...articles.map(a => a.id)) + 1
            : 1;
        // Convert category_id from string to number
        articleData.category_id = parseInt(articleData.category_id);
        // Add the new article to the list
        articles.push(articleData);
        resolve(articleData);
    });
}

// // Get articles by category
// function getArticlesByCategory(category) {
//     return new Promise((resolve, reject) => {
//         const filtered = articles.filter(article => article.category == category);
//         if (filtered.length > 0) resolve(filtered);
//         else reject("no results returned");
//     });
// }

// // Get articles by category (Return published articles only)
// function getArticlesByCategory(categoryId) {
//     return new Promise((resolve, reject) => {
//         const id = parseInt(categoryId); // Make sure is number
//         const filtered = articles.filter(article =>
//             article.category_id === id && article.published
//         );
//         if (filtered.length > 0) resolve(filtered);
//         else reject("No articles found for this category");
//     });
// }

function getArticlesByCategory(categoryId) {
    return new Promise((resolve, reject) => {
        const id = parseInt(categoryId);
        const filtered = articles
            .filter(article => article.category_id === id && article.published)
            .map(article => ({
                ...article,
                category_name: getCategoryNameById(article.category_id)
            }));
        if (filtered.length > 0) resolve(filtered);
        else reject("No articles found for this category");
    });
}

// Get articles by minimum date (Return published articles only)
function getArticlesByMinDate(minDateStr) {
    return new Promise((resolve, reject) => {
        const minDate = new Date(minDateStr);
        // const filtered = articles.filter(article => new Date(article.published_date) >= minDate);
        const filtered = articles.filter(article =>
            article.published &&
            new Date(article.published_date) >= minDate
        );
        if (filtered.length > 0) resolve(filtered);
        else reject("no results returned");
    });
}

function getArticlesByAuthor(authorName) {
    return new Promise((resolve, reject) => {
        const filtered = articles.filter(article =>
            article.published && article.author.toLowerCase().includes(authorName.toLowerCase())
        );
        if (filtered.length > 0) resolve(filtered);
        else reject("No articles found for that author");
    });
}

// Get article by ID (Return published articles only)
function getArticleById(id) {
    return new Promise((resolve, reject) => {
        // const found = articles.find(article => article.id == id);
        const found = articles.find(article => article.id === parseInt(id));
        // if (found) resolve(found);
        if (found && found.published) resolve(found);
        else reject("no result returned");
    });
}

function getCategoryNameById(id) {
    const category = categories.find(c => c.id === id);
    return category ? category.name : 'Unknown';
}

// Export the functions
module.exports = {
    initialize,
    getPublishedArticles,
    getAllArticles, // ?
    getCategories,
    addArticle,
    getArticlesByCategory,
    getArticlesByMinDate,
    getArticlesByAuthor,
    getArticleById,
    getCategoryNameById
};
*/
