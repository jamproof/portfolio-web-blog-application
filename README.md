# TechScope Blog Server

Welcome to the **TechScope Blog**, a simple Node.js-based web application that serves articles and categories related to technology, artificial intelligence, climate science, and space exploration.

## 🌐 Live Routes

- `/home` – Home page  
- `/about` – About the blog and author  
- `/articles` – Returns JSON data for all published articles  
- `/categories` – Returns JSON data for all available categories  

**GitHub URL**:  
https://github.com/jamproof/portfolio-web-blog-application.git

**Vercel URLs**:  
- https://portfolio-web-blog-application.vercel.app  
- https://portfolio-web-blog-application-git-main-jamproofs-projects.vercel.app  
- https://portfolio-web-blog-application-k7h68aflw-jamproofs-projects.vercel.app  

---

### 🧰 Technology Stack

**Frontend**  
- HTML  
- CSS  
- Bootstrap 5  

**Backend**  
- Node.js  
- Express (Server Framework)  

**Data Storage**  
- JSON files (local)  

**File Handling**  
- Node.js `fs` module  

---

### 📝 Notes

- This is a learning-focused project built without a database — data is stored in local JSON files.  
- `/articles` and `/categories` are **dynamic API routes** that return JSON data based on `articles.json` and `categories.json`.  
- Articles marked `"published": true` are returned by the `/articles` endpoint.  
- Use browser developer tools or tools like Postman to test the JSON API endpoints directly.  
- The front-end uses static HTML pages; you can extend them with JavaScript to fetch and display dynamic content from the API.  

---

&copy; 2025 JamProof – jamproof0701@gmail.com
