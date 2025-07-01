# 📰 TechScope Blog – RESTful Blog Server

Welcome to the **TechScope Blog**, a simple Node.js-based web application that serves articles and categories related to technology, artificial intelligence, climate science, and space exploration.

## 🌐 Live Routes

- `/home` – Home page  
- `/about` – About the blog and author  
- `/articles` – Returns JSON data for all published articles  
- `/categories` – Returns JSON data for all available categories  
- `/articles/add` – Add a new article using a form, with optional image upload support  

**GitHub Repository:**  
* https://github.com/jamproof/portfolio-web-blog-application.git

---

## 🚀 Deployment Status

The **TechScope Blog** has been successfully deployed using [Vercel](https://vercel.com/):

- 🌐 **Live Site:** https://portfolio-web-blog-application.vercel.app
- 🔄 API routes are fully functional and respond with JSON data as expected.
- 🖼 Image upload via Cloudinary is integrated in the live environment.

**Vercel deployment URLs:**  
- https://portfolio-web-blog-application.vercel.app  
- https://portfolio-web-blog-application-git-main-jamproofs-projects.vercel.app  
- https://portfolio-web-blog-application-k7h68aflw-jamproofs-projects.vercel.app  

---

## 🧪 API Testing with Postman

- API endpoints were tested successfully using **Postman Web** after deployment.
- Example testable routes:
  - `GET https://portfolio-web-blog-application.vercel.app/articles`
  - `GET https://portfolio-web-blog-application.vercel.app/articles?category_id=2`
  - `GET https://portfolio-web-blog-application.vercel.app/articles?minDate=2025-06-23`
  - `GET https://portfolio-web-blog-application.vercel.app/article/1`
  - `GET https://portfolio-web-blog-application.vercel.app/categories`
- ✅ Works in **Postman Web** since the API is hosted online.
- ⚠️ For local development, use **Postman Desktop Agent** when testing `http://localhost`.

---

## 🧰 Technology Stack

### 🖼 Frontend
- **HTML5** – Content structure  
- **CSS3** – Styling  
- **Bootstrap 5** – Responsive layout & UI components

### 🔧 Backend
- **Node.js** – JavaScript runtime environment  
- **Express.js** – Web application framework for building RESTful APIs and routing

### 🗂 Data Storage
- **Local JSON files** (`articles.json`, `categories.json`) – Simulates a database for articles and categories

### 📤 File Upload & Cloud Storage
- **Multer** – Middleware for handling `multipart/form-data` and file uploads (in-memory storage)  
- **Cloudinary** – Cloud image hosting and CDN service for storing uploaded images  
- **Streamifier** – Converts file buffers into readable streams (used for Cloudinary upload integration)

### 📁 File System Access
- **Node.js `fs/promises` module** – Asynchronous file operations for reading/writing JSON data

**Middleware & Utilities**

* `express.urlencoded` for parsing URL-encoded form data
* `express.static` for serving static files from `/public` directory

---

## ✨ Features

- View published articles in JSON format via `/articles`  
- Filter articles by `category_id` or `minDate` using query parameters  
- Upload images for articles and store them on **Cloudinary**  
- Add new articles via a form (`/articles/add`)  
- Browse categories via `/categories`  
- Fully static front-end with dynamic back-end API routes  
- Error handling for missing data or invalid routes

---

## 📝 Notes

- This is a learning-focused project built without a database — data is stored in local JSON files.  
- `/articles` and `/categories` are **dynamic API routes** that return JSON data based on `articles.json` and `categories.json`.  
- Articles marked `"published": true` are returned by the `/articles` endpoint.  
- Use browser developer tools or tools like Postman to test the JSON API endpoints directly.  
- The front-end uses static HTML pages; you can extend them with JavaScript to fetch and display dynamic content from the API.  

---

&copy; 2025 JamProof – jamproof0701@gmail.com





# 📰 TechScope Blog – Full-Stack Blog Platform

Welcome to **TechScope Blog**, a full-stack Node.js web application for publishing and browsing articles across technology, AI, space, and science topics. Built with Express, EJS, and Bootstrap 5, it supports filtering, category browsing, article previews, and Cloudinary-based image uploads.

## 🌐 Live Routes

| Route                 | Description                                      |
|----------------------|--------------------------------------------------|
| `/home`              | Home page                                        |
| `/about`             | About the blog and author                        |
| `/articles`          | Browse all published articles with filters       |
| `/articles/add`      | Add a new article via form + image upload        |
| `/article/:id`       | View full article details                        |
| `/categories`        | Browse available categories                      |

🔗 **GitHub Repository:**  
* https://github.com/jamproof/portfolio-web-blog-application.git

---

## 🚀 Deployment Status

The **TechScope Blog** has been successfully deployed using [Vercel](https://vercel.com/):

- 🌐 **Main Site:**  
  https://portfolio-web-blog-application.vercel.app

- 🔄 API endpoints and pages are fully functional
- 🖼 Image uploads are handled via **Cloudinary**

> ✅ API routes were tested using **Postman Web**

### Sample Testable Endpoints

- `GET /articles`
- `GET /articles?category_id=2`
- `GET /articles?minDate=2025-06-21`
- `GET /article/1`
- `GET /categories`

> ⚠️ For local testing, use **Postman Desktop Agent** to avoid CORS errors with `http://localhost`.

---

## ✨ Features

- 📰 View all published articles with:
  - ✅ Keyword search
  - ✅ Author filter
  - ✅ Category filter
  - ✅ Date filtering
- 🧾 Full article detail view
- 📤 Add new articles with optional **image upload**
- 🖼 Image previews on form submission
- 📂 Categories listing and filtering
- 🧰 Modular, file-based data storage (`articles.json`, `categories.json`)
- 💡 Responsive Bootstrap 5 design with EJS templates

---

## 🧪 Tech Stack

### 🖼 Frontend
- **HTML5** – Page structure  
- **CSS3** – Custom styling  
- **Bootstrap 5** – Modern responsive layout  
- **EJS** – Server-side templating engine

### 🔧 Backend
- **Node.js** – Runtime  
- **Express.js** – Web framework  

### 🗂 Data & Files
- **Local JSON files** for data simulation
  - `data/articles.json`
  - `data/categories.json`
- **`fs/promises`** for async file I/O

### 📤 Media & File Uploads
- **Multer** – Handles image uploads (in-memory)  
- **Cloudinary** – Hosts uploaded images  
- **Streamifier** – Converts buffer to stream for Cloudinary

---

## 🗃 Project Structure

project/
├── data/                          # JSON files simulating a database
│   ├── articles.json              # Article data
│   └── categories.json            # Category data
├── public/                        # Static assets
│   ├── css/
│   │   └── site.css               # Custom CSS styles
│   └── img/                       # Images folder
├── view/                          # EJS templates
│   ├── partials/
│   │   ├── footer.ejs             # Footer partial
│   │   └── navbar.ejs             # Navbar partial
│   ├── 404.ejs                    # Not found page
│   ├── home.ejs                   # Home page
│   ├── about.ejs                  # About page
│   ├── article.ejs                # Single article view
│   ├── articles.ejs               # Articles listing page
│   ├── categories.ejs             # Categories listing
│   └── addArticle.ejs             # Form to add a new article
├── content-service.js             # Business logic & data service layer
└── server.js                      # Express app and routing

### 🎨 Frontend (UI & Static Assets)

project/
├── public/                        # 🌐 Static Assets
│   ├── css/
│   │   └── site.css               # 🎨 Custom site-wide styles
│   └── img/                       # 🖼️ Image assets (optional)

├── view/                          # 🧩 UI Templates (EJS)
│   ├── partials/                  # 🔁 Reusable components
│   │   ├── navbar.ejs             # 🌐 Site navigation bar
│   │   └── footer.ejs             # 📄 Footer section
│   ├── home.ejs                   # 🏠 Home page
│   ├── about.ejs                  # 👤 About page
│   ├── article.ejs                # 📄 Single article view
│   ├── articles.ejs               # 🗂️ Articles list with filters
│   ├── categories.ejs             # 📚 Categories list
│   ├── addArticle.ejs             # 📝 Form to add a new article
│   └── 404.ejs                    # ❌ Not Found error page

### ⚙️ Backend (API, Routing, Data Layer)

project/
├── server.js                      # 🚀 Express server, routing, middleware, Cloudinary integration

├── content-service.js             # 🧠 Data logic: fetch, filter, and transform articles/categories

├── data/                          # 📦 Simulated Database
│   ├── articles.json              # 📰 All articles data
│   └── categories.json            # 📂 Article categories

---

## 📝 Notes

- Data is **stored locally** — no external database is used.
- Articles must be marked as `"published": true` to appear in `/articles`.
- I will extend this project with:
  - MongoDB/PostgreSQL integration
  - User login/authentication
  - Draft status for unpublished articles
- The form on `/articles/add` allows image previews **before** upload.

---

## 📌 Known Limitations

- No persistent DB — changes to articles/categories will reset unless saved to file manually.
- No authentication — anyone can add articles from the form.

---

## 👤 Author

**JamProof**  
📧 jamproof0701@gmail.com  
🌐 [https://github.com/jamproof](https://github.com/jamproof)

---

&copy; 2025 JamProof. All rights reserved.
