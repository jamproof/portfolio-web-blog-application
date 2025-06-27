# 📰 TechScope Blog – RESTful Blog Server

Welcome to the **TechScope Blog**, a simple Node.js-based web application that serves articles and categories related to technology, artificial intelligence, climate science, and space exploration.

## 🌐 Live Routes

- `/home` – Home page  
- `/about` – About the blog and author  
- `/articles` – Returns JSON data for all published articles  
- `/categories` – Returns JSON data for all available categories  
- `/articles/add` – Add a new article using a form, with optional image upload support  

**GitHub URL**:  
* https://github.com/jamproof/portfolio-web-blog-application.git

**Vercel URLs**:  
- https://portfolio-web-blog-application.vercel.app  
- https://portfolio-web-blog-application-git-main-jamproofs-projects.vercel.app  
- https://portfolio-web-blog-application-k7h68aflw-jamproofs-projects.vercel.app  

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

### 📝 Notes

- This is a learning-focused project built without a database — data is stored in local JSON files.  
- `/articles` and `/categories` are **dynamic API routes** that return JSON data based on `articles.json` and `categories.json`.  
- Articles marked `"published": true` are returned by the `/articles` endpoint.  
- Use browser developer tools or tools like Postman to test the JSON API endpoints directly.  
- The front-end uses static HTML pages; you can extend them with JavaScript to fetch and display dynamic content from the API.  

---

&copy; 2025 JamProof – jamproof0701@gmail.com

<!-- # TechScope Blog Server -->

<!-- ### 🧰 Technology Stack

**Frontend**  
- HTML  
- CSS  
- Bootstrap 5  

**Backend**  
- Node.js  
- Express (Server Framework)  

**Data Storage**  
- JSON files stored locally (`articles.json`, `categories.json`)  

**File Handling & Uploads**

* `fs` (Node.js file system module) for reading JSON data
* `multer` for handling multipart/form-data and file uploads (in-memory storage)
* `cloudinary` for cloud image hosting
* `streamifier` to convert in-memory buffer into stream for Cloudinary upload -->
