# ⚖️ Lawsarthi — Indian Constitution AI Chatbot

Lawsarthi is a full-stack AI chatbot that answers questions about the **Indian Constitution**. It uses semantic search powered by **pgvector** and **sentence-transformers** to retrieve relevant constitutional articles, with a modern React frontend that resembles a ChatGPT-style chat interface.

---

## 🗂️ Project Structure

```
lawsarthi/
├── backend/
│   ├── app.py                      # Flask API server
│   ├── chatbot_query.py            # Query logic, semantic search, hallucination guard
│   ├── pgvector_embeddings_db.py   # Database & table setup
│   ├── insert_articles.py          # Import articles from CSV
│   ├── embedd_all.py               # Generate and store embeddings
│   ├── chunk_all.py                # Chunk long articles for better retrieval
│   ├── requirements.txt            # Python dependencies
│   └── Constitution_of_India.csv  # Source data (add this yourself)
│
├── src/
│   ├── pages/
│   │   └── Index.tsx               # Main chat page, state management
│   ├── components/
│   │   ├── ChatInput.tsx           # Input bar with voice, edit, clear
│   │   ├── ChatMessage.tsx         # Individual message bubble
│   │   ├── ChatSidebar.tsx         # Sidebar with pinned/recent/archived chats
│   │   ├── WelcomeScreen.tsx       # Landing screen with quick suggestions
│   │   ├── Navbar.tsx,NavLink.tsx            # Top bar with share/pin/archive/delete
│   │   ├── LoadingState.tsx,types.ts       # Typing indicator
│   │   └── ErrorState.tsx          # Error + retry UI
│   └── index.css                   # Tailwind + custom theme (navy + teal)
│
├── index.html
├── package.json
├── tailwind.config.ts
└── vite.config.ts
```

---

## 🧠 How It Works

```
User Question
     │
     ▼
Is it about the Constitution? ──No──▶ "I can only answer questions about the Indian Constitution."
     │
    Yes
     │
     ▼
Does it mention a specific article number? ──Yes──▶ Direct DB lookup → Return article
     │
    No
     │
     ▼
Is it about citizenship? ──Yes──▶ Return short summary of Articles 5–11
     │
    No
     │
     ▼
Semantic search using pgvector (cosine similarity ≥ 0.75) → Return best matching article
     │
     ▼
No match? → "No relevant article found."
```

---

## ⚙️ Tech Stack

| Layer      | Technology                                        |
|------------|---------------------------------------------------|
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend    | Python, Flask, Flask-CORS                         |
| Database   | PostgreSQL + pgvector extension                   |
| Embeddings | `sentence-transformers` (`all-MiniLM-L6-v2`)      |
| UI Icons   | Lucide React                                      |

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js ≥ 18 and npm
- Python ≥ 3.9
- PostgreSQL ≥ 14 with the [pgvector extension](https://github.com/pgvector/pgvector)

---

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd lawsarthi
```

---

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

#### Install pgvector (Ubuntu/Debian)

```bash
sudo apt install postgresql-14-pgvector
```

For other systems, see: https://github.com/pgvector/pgvector#installation

#### Configure the Database

The default connection settings used across backend files are:

```python
host     = "localhost"
database = "lawchatbot"
user     = "postgres"
password = "newpassword"
```

To change these, update the `get_db_connection()` function in `chatbot_query.py` and the `DB_CONFIG` dict in the other backend files.

#### Initialize the Database

```bash
python pgvector_embeddings_db.py
```

#### Import Articles

Place your `Constitution_of_India.csv` file in the `backend/` folder, then run:

```bash
python insert_articles.py
```

The CSV should have columns: `article`, `title`, `chunk` (text content).

#### Generate Embeddings

```bash
python embedd_all.py
```

This may take a few minutes on first run as it downloads the `all-MiniLM-L6-v2` model.

#### Start the Flask Server

```bash
python app.py
```

The API will be available at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
# From the project root
npm install
npm run dev
```

The app will open at: `http://localhost:5173`

By default the frontend calls `http://localhost:5000`. To use a different backend URL, create a `.env` file in the project root:

```
VITE_API_URL=http://your-backend-url
```

---

## 🔌 API Reference

### `POST /chat`

Send a question to the chatbot.

**Request body:**
```json
{
  "message": "What does Article 21 say?"
}
```

**Response:**
```json
{
  "response": "📜 **Article 21: Protection of Life and Personal Liberty**\n\nNo person shall be deprived of his life or personal liberty except according to procedure established by law."
}
```

---

### `GET /health`

Check if the server is running.

**Response:**
```json
{
  "status": "healthy",
  "service": "Lawsarthi API"
}
```

---

## 💬 Frontend Features

| Feature | Description |
|---|---|
| **Chat history** | Each conversation is stored and restored when selected from the sidebar |
| **New chat** | Resets the current view; creates a new entry on first message |
| **Pinned / Recent / Archived** | Sidebar sections auto-populate based on chat state |
| **Sidebar search** | Filters chats by title in real time |
| **Suggested questions** | Clickable prompts on the welcome screen that auto-send |
| **Voice input** | Uses the Web Speech API (`en-IN` locale) |
| **Edit last message** | Re-loads your previous message into the input for editing |
| **Copy message** | Copies any assistant response to clipboard |
| **Share full chat** | Copies the entire conversation as plain text via the Navbar |
| **Markdown rendering** | `**bold**` and line breaks in API responses are rendered correctly |
| **Pin / Archive / Delete** | Navbar dropdown actions that update live state |

---

## 🛡️ Hallucination Guard

The backend checks every question against a list of constitutional keywords before querying the database. If the question is unrelated to the Indian Constitution, it immediately returns:

> *"I can only answer questions related to the Indian Constitution."*

This prevents the model from attempting to answer general legal or off-topic questions.

---

## 🔍 Article Matching Logic

| Input format | Matched? |
|---|---|
| `Article 21` | ✅ |
| `article21` | ✅ |
| `Article-21` | ✅ |
| `article 21a` | ✅ |
| `ARTICLE  21` | ✅ |

The regex used: `r'article\s*[-]?\s*(\d+[a-z]?)'`

---

## 🛠️ Troubleshooting

**`psycopg2` connection error**
- Confirm PostgreSQL is running: `sudo service postgresql status`
- Check your DB credentials match what's in `chatbot_query.py`

**`pgvector` extension not found**
- Run in psql: `CREATE EXTENSION vector;`
- Ensure the pgvector package is installed for your PostgreSQL version

**No results / all below threshold**
- Confirm embeddings were generated: check the `embedding` column is populated
- Re-run `python embedd_all.py` if needed

**Frontend can't reach backend**
- Check `VITE_API_URL` or confirm Flask is running on port 5000
- CORS is enabled by default via `flask-cors`

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🙏 Acknowledgements

- [pgvector](https://github.com/pgvector/pgvector) — vector similarity search for PostgreSQL
- [sentence-transformers](https://www.sbert.net/) — `all-MiniLM-L6-v2` embedding model
- [shadcn/ui](https://ui.shadcn.com/) — accessible React component library
- Constitution of India source data
