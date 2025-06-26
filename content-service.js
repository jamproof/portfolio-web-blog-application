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

// Export the functions
module.exports = {
    initialize,
    getPublishedArticles,
    getAllArticles,
    getCategories
};
