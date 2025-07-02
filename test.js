require('dotenv').config();
const db = require('./content-service');

async function runTests() {
    try {
        console.log('\n📚 Categories:');
        const categories = await db.getCategories();
        console.log(categories);

        console.log('\n📰 Published Articles:');
        const articles = await db.getPublishedArticles();
        console.log(articles);

        console.log('\n✍️ Articles by author "Jane":');
        const janeArticles = await db.getArticlesByAuthor('Jane');
        console.log(janeArticles);

        console.log('\n🗓️ Articles published after 2025-06-20:');
        const recentArticles = await db.getArticlesByMinDate('2025-06-20');
        console.log(recentArticles);

        console.log('\n🔍 Article by ID:');
        const article = await db.getArticleById(1);
        console.log(article);

        console.log('\n➕ Adding a new article:');
        const newArticle = await db.addArticle({
            title: 'Test Article',
            author: 'Tester',
            category_id: 1,
            published_date: '2025-07-02',
            content: 'This is a test article',
            published: true
        });
        console.log(newArticle);

        console.log('\n📂 Articles in category 1:');
        const techArticles = await db.getArticlesByCategory(1);
        console.log(techArticles);

        console.log("🔌 DATABASE_URL:", process.env.DATABASE_URL);

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        process.exit();
    }
}

runTests();
