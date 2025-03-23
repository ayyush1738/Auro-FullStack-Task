# 💡 Auro Full Stack Task – RAG-based Web Application

**Live Demo:** 👉 [Run the App](https://auro-full-stack-task.vercel.app/)

This is a full-stack web application that implements Retrieval-Augmented Generation (RAG) using FastAPI for the backend and Vite + Tailwind CSS for the frontend. It uses Redis for caching and PostgreSQL (with `pgvector`) for vector-based semantic search.

---

## 🚀 Getting Started – Run the Backend Server Locally

### 1. Clone the Repository

```bash
git clone https://github.com/ayyush1738/Auro-FullStack-Task.git
cd Auro-FullStack-Task
```

---

### 2. Navigate to the Backend

```bash
cd rag-backend
```

---

### 3. Check Prerequisites

Make sure you have **Redis** and **PostgreSQL** installed:

```bash
psql --version
redis-server --version
```

If not installed, download from:

- ✅ **Redis (Windows via Memurai or Redis Stack):**  
  https://redis.io/docs/install/install-redis-on-windows/

- ✅ **PostgreSQL:**  
  https://www.postgresql.org/download/

---

### 4. Start Redis and PostgreSQL

Open **separate terminals** and run the following:

- **Terminal 1: Start Redis Server**

```bash
redis-server.exe
```

- **Terminal 2: Start PostgreSQL CLI**

```bash
psql -U postgres
```

> Adjust the username if yours is different. Ensure your database is set up correctly.

---

### 5. Set Up the Python Virtual Environment

- **Terminal 3: Create and Activate Environment**

```bash
python -m venv venv
.\venv\Scripts\activate  # For Windows
```

---

### 6. Install Python Dependencies

```bash
pip install --no-cache-dir -r requirements.txt
```

---

### 7. Run the FastAPI Server

```bash
uvicorn app.main:app --reload
```

Once the server starts, it should be accessible at:

```
http://localhost:8000
```

---

## 📢 Contact

Made by [@ayyush1738](https://github.com/ayyush1738)
Also do checkout [Ayush-Portfolio](https://ayush-portfolio-rust.vercel.app/)

