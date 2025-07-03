# 📰 TechScope Blog – Full-Stack Blog Platform

Welcome to **TechScope Blog** — a full-stack Node.js web application for creating, browsing, editing, and deleting articles on topics like technology, AI, space, and science. It features article filtering by author, date, or category, along with full-text keyword search.
Built with **Node.js**, **Express.js**, **EJS**, **Bootstrap 5**, **PostgreSQL** (via **Neon.tech**), and **Cloudinary** for image uploads.

---

## 🌐 Live Demo & API

The **TechScope Blog** is live and fully functional via [Vercel](https://vercel.com/):

- 🔗 **Main Site**:  
  https://portfolio-web-blog-application.vercel.app

- 🧪 **API & Page Routes**:
  | Route                         | Description                                       |
  |------------------------------|---------------------------------------------------|
  | `/home`                      | Home page                                         |
  | `/about`                     | About the blog and author                         |
  | `/articles`                  | Browse all published articles with filters        |
  | `/articles/add`              | Add a new article (image upload supported)        |
  | `/article/:id`               | View full article details                         |
  | `/articles/:id/edit`         | Edit an existing article                          |
  | `PUT /articles/:id`          | Update article content & image via form           |
  | `DELETE /articles/:id`       | Remove an article                                 |
  | `/categories`                | Browse all categories                             |

> ✅ API routes return either HTML (via EJS) or JSON depending on usage context.  
> ✅ Image uploads are handled via **Cloudinary**.  
> ✅ API routes tested via **Postman Web** and **Postman Desktop Agent** (for local).

### 🚀 Deployment Notes: Live Deployment (Vercel)

- Main: https://portfolio-web-blog-application.vercel.app  
- Preview: https://portfolio-web-blog-application-git-main-jamproofs-projects.vercel.app  
- Alt: https://portfolio-web-blog-application-k7h68aflw-jamproofs-projects.vercel.app

---

## ✨ Features

- 📋 **CRUD operations**: create, read, update, delete articles.
- 🏷️ **Filters**: keyword search, by author, category, or date.
- 🖼️ **Image uploads** via Cloudinary with preview and removal options.
- ✏️ **Edit feature**: inline route/link to modify or delete articles.
- 🛠️ **DB-backed**: Uses PostgreSQL (Neon.tech) for persistent storage.
- 🛡️ **Method override** for handling PUT/DELETE via HTML forms.

---

## 🛠️ Tech Stack

### 🖼 Frontend
- **HTML5** – Structure  
- **CSS3** – Styling  
- **Bootstrap 5** – UI framework  
- **EJS** – Server-side templating engine

### 🔧 Backend
- **Node.js / Express.js** — Backend server & routing  
- **PostgreSQL** – Persistent relational database (via Neon.tech)  
- **Multer + Streamifier + Cloudinary** – Image file handling & storage  
- **dotenv** – Secure environment variable management

---

## 🗃 Project Structure

```
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
│   ├── article.ejs                # Article detail view
│   ├── articles.ejs               # Articles listing page
│   ├── categories.ejs             # Categories listing page
│   ├── addArticle.ejs             # Form to add a new article
│   └── editArticle.ejs            # Form to edit published article
├── content-service.js             # Business logic & data service layer
└── server.js                      # Express app and routing
```

### 🎨 Frontend (UI & Static Assets)

```
project/
├── public/                        # 🌐 Static Assets
│   ├── css/
│   │   └── site.css               # 🎨 Custom styles
│   └── img/                       # 🖼️ Image assets

├── view/                          # 🧩 EJS Templates
│   ├── partials/                  # 🔁 Reusable components
│   │   ├── navbar.ejs             # 🌐 Site navigation bar
│   │   └── footer.ejs             # 📄 Footer section
│   ├── home.ejs                   # 🏠 Home page
│   ├── about.ejs                  # 👤 About page
│   ├── article.ejs                # 📄 Single article view
│   ├── articles.ejs               # 🗂️ Articles list with filters
│   ├── categories.ejs             # 📚 Categories list
│   ├── addArticle.ejs             # 📝 Form to add a new article
│   ├── editArticle.ejs            # ✏️ Form to edit existing article
│   └── 404.ejs                    # ❌ Not Found error page
```

### ⚙️ Backend (API, Routing, Database)

```
project/
├── server.js                      # 🚀 Express app, routes, uploads

├── content-service.js             # 🧠 DB logic: query & filter

├── data/                          # 📦 Simulated Database
│   ├── articles.json              # 📰 All articles data
│   └── categories.json            # 📂 Article categories
```

---

## 📝 Developer Notes

- Articles must be `"published": true` to appear on the public `/articles` page.
- Both `/articles/add` and `/articles/:id/edit` support image preview before upload.
- Images are uploaded and hosted using **Cloudinary**, with support for **removing or replacing** existing feature images.
- Articles are stored in a **PostgreSQL database** (via [Neon.tech](https://neon.tech)), not local files.
- Full CRUD is implemented: create, read, update, delete articles via the admin UI.
- Supports filtering articles by **category**, **date**, **author**, and **keyword search**.
- The backend uses **async/await with error handling** for all database operations.
- Admin panel built with **EJS templates**, Bootstrap 5, and Express.js middleware.
- `.env` file is required for PostgreSQL and Cloudinary credentials.

---

## 🔐 Environment Variables

To run the project locally or in your own deployment environment, create a `.env` file in the root of the project and include the following keys:

```env
# .env (example)

# PostgreSQL Database URL (via Neon.tech)
DATABASE_URL=postgresql://your-username:your-password@your-host:your-port/your-database

# Cloudinary Credentials for Image Uploads
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-secret

# Port for local development (optional, defaults to 3000)
PORT=2025
````

> ⚠️ **Important**: Never commit your `.env` file to source control. Use `.gitignore` to keep it secure.

---

## ✅ Implemented Features

- ✅ PostgreSQL backend via `pg` + Neon.tech  
- ✅ Cloud image upload with **Cloudinary**  
- ✅ Create/edit article forms with live image preview  
- ✅ Support for `"published"` vs `"draft"` states  
- ✅ Full-text search across title/content  
- ✅ Filter articles by category, author, or date  
- ✅ Delete articles from admin panel  
- ✅ HTTP method override for PUT/DELETE routes  
- ✅ Modular DB logic in `content-service.js`

---

## 📌 Known Limitations

- ❌ No user login/authentication — admin routes are **public**
- ❌ No role-based access — anyone can POST/EDIT articles
- ⚠️ No WYSIWYG editor for content (markdown/raw HTML only)
<!-- 🔍 WYSIWYG stands for “What You See Is What You Get” — a text editor that lets users format content visually (like bold/italic, images, bullet lists) without writing HTML or Markdown. -->
- ⚠️ No pagination or lazy-loading for long article lists
<!-- Currently rendering all articles on /articles. If there are 100+ articles, it will load them all at once. -->

---

## 👤 Author

**JamProof**  
📧 jamproof0701@gmail.com  
🌐 [https://github.com/jamproof](https://github.com/jamproof)

---

&copy; 2025 JamProof. All rights reserved.

<!--  -->
<!--  -->
<!--  -->

<!-- # 📰 TechScope Blog – Full-Stack Blog Platform

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

```
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
```

### 🎨 Frontend (UI & Static Assets)

```
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
```

### ⚙️ Backend (API, Routing, Data Layer)

```
project/
├── server.js                      # 🚀 Express server, routing, middleware, Cloudinary integration

├── content-service.js             # 🧠 Data logic: fetch, filter, and transform articles/categories

├── data/                          # 📦 Simulated Database
│   ├── articles.json              # 📰 All articles data
│   └── categories.json            # 📂 Article categories
```

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

&copy; 2025 JamProof. All rights reserved. -->

<!--  -->
<!--  -->
<!--  -->

<!-- # 📰 TechScope Blog – RESTful Blog Server

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

&copy; 2025 JamProof – jamproof0701@gmail.com -->
