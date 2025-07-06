# 📰 TechScope Blog – Full-Stack Blog Platform

_A fully deployed Node.js blogging platform featuring image upload, SQL-backed filtering, and EJS-rendered pages._

![screenshot](./public/img/blog-articles-page.jpg)

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
  | `/article/:id/edit`          | Edit an existing article                          |
  | `PUT /article/:id`           | Update article content & image via form           |
  | `DELETE /article/:id`        | Remove an article                                 |
  | `/categories`                | Browse all categories                             |

> ✅ Most routes return **server-rendered HTML** (via EJS templates).  
> ⚠️ JSON responses are only returned for **form validation errors** or **internal error messages**.  
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
- **Method-override** – PUT/DELETE requests
- **dotenv** – Secure environment variable management

---

## 🗃 Project Structure

```
project/
├── backup/                        # Archived legacy JSON files from earlier development stages (for reference only)
│   └── data/                      # JSON files simulating a database (previously used for development)
│       ├── articles.json          # Article data
│       └── categories.json        # Category data
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

├── backup/                        # 🗃 Archived JSON files from earlier development stages
│   └── data/                      # 📦 Simulated Database
│       ├── articles.json          # 📰 All articles data
│       └── categories.json        # 📂 Article categories
```

---

## 🗃 Data Sources

This project **now uses PostgreSQL** as the single source of truth for all articles and categories. All former `data/articles.json` and `data/categories.json` files are deprecated and **moved to `/backup/` for archival purposes only**.

See [`/backup/data/README.md`](./backup/data/README.md) for details.

---

## 📝 Developer Notes

- Articles must be `"published": true` to appear on the public `/articles` page.
- Both `/articles/add` and `/article/:id/edit` support image preview before upload.
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

## 📁 Legacy Data

Archived legacy data can be found in the `/backup/data/` folder. These JSON files were used during development prior to PostgreSQL integration. Do **not** use them in current application logic.

---

## 📌 Known Limitations

- ❌ No user login/authentication — admin routes are **public**
- ❌ No role-based access — anyone can POST/EDIT/DELETE articles
- ⚠️ No WYSIWYG editor for content (markdown/raw HTML only)
<!-- 🔍 WYSIWYG stands for “What You See Is What You Get” — a text editor that lets users format content visually (like bold/italic, images, bullet lists) without writing HTML or Markdown. -->
- ⚠️ No pagination or lazy-loading for long article lists
<!-- Currently rendering all articles on /articles. If there are 100+ articles, it will load them all at once. -->

---

## ✅ To Do / Future Improvements

* User authentication and roles
* Admin dashboard for category/article management
* Tag-based article filtering
* Pagination and search enhancement

---

## 👤 Author & Project Purpose

This project was built as a personal portfolio piece to demonstrate full-stack capabilities with Node.js.  

**JamProof**  
📧 jamproof0701@gmail.com  
🌐 [https://github.com/jamproof](https://github.com/jamproof)

---

&copy; 2025 JamProof. All rights reserved.
