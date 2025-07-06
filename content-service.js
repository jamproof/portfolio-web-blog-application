require('dotenv').config(); // Load environment variables
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

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
    getFilteredArticles,
    getArticleById,
    getCategoryNameById,
    updateArticle,
    deleteArticle
};
