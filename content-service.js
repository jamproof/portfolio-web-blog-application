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

// Return published articles only
function getPublishedArticles() {
    return new Promise((resolve, reject) => {
        const published = articles.filter(article => article.published === true);
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

// Get articles by category (Return published articles only)
function getArticlesByCategory(categoryId) {
    return new Promise((resolve, reject) => {
        const id = parseInt(categoryId); // Make sure is number
        const filtered = articles.filter(article =>
            article.category_id === id && article.published
        );
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
    getArticleById
};
