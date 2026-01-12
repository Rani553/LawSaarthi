# 🏛️ Lawsarthi Backend

AI-powered Indian Constitution chatbot using semantic search with pgvector.

## 📁 Project Structure

```
backend/
├── app.py                 # Flask API server (main entry point)
├── chatbot_query.py       # Query logic & semantic search
├── pgvector_embeddings_db.py  # Database setup
├── insert_articles.py     # Import CSV data
├── embedd_all.py          # Generate embeddings
├── chunk_all.py           # Handle large articles
├── requirements.txt       # Python dependencies
├── Constitution_of_India.csv  # Your data file (add this)
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Setup PostgreSQL with pgvector
```bash
# Install pgvector extension (Ubuntu/Debian)
sudo apt install postgresql-14-pgvector

# Or for other systems, see: https://github.com/pgvector/pgvector
```

### 3. Configure Database
Edit `DB_CONFIG` in the Python files if needed:
```python
DB_CONFIG = {
    'dbname': 'lawchatbot',
    'user': 'postgres',
    'password': 'newpassword',  # Change this!
    'host': 'localhost',
    'port': '5432'
}
```

### 4. Initialize Database
```bash
python pgvector_embeddings_db.py
```

### 5. Import Articles
```bash
# Place your Constitution_of_India.csv in the backend folder
python insert_articles.py
```

### 6. Generate Embeddings
```bash
python embedd_all.py
```

### 7. Start the Server
```bash
python app.py
```

Server runs at: `http://localhost:5000`

## 🔌 API Endpoints

### POST /chat
Send a message to the chatbot.

**Request:**
```json
{
  "message": "What is Article 21?"
}
```

**Response:**
```json
{
  "response": "📜 **Article 21: Protection of Life and Personal Liberty**\n\nNo person shall be deprived of his life or personal liberty except according to procedure established by law."
}
```

### GET /health
Check if the server is running.

## 🔗 Connect to Frontend

The Lovable frontend is configured to connect to `http://localhost:5000`.

For production, set the `VITE_API_URL` environment variable in Lovable.

## 📊 How It Works

1. **User Query** → Flask API receives message
2. **Pattern Match** → Check for article numbers (e.g., "Article 21")
3. **Keyword Search** → Check for topics (e.g., "citizenship")
4. **Semantic Search** → Use pgvector for similarity matching
5. **Response** → Return formatted constitutional articles

## 🛠️ Troubleshooting

**Database connection error:**
- Ensure PostgreSQL is running
- Check credentials in DB_CONFIG

**pgvector not found:**
- Install the pgvector extension for your PostgreSQL version

**No results found:**
- Ensure articles are imported: `python insert_articles.py`
- Ensure embeddings are generated: `python embedd_all.py`

## 📝 License

MIT License - Feel free to use and modify!
