"""
Chunk Large Articles for Better Embedding
Splits long descriptions into smaller chunks
"""

import psycopg2
from sentence_transformers import SentenceTransformer

DB_CONFIG = {
    'dbname': 'lawchatbot',
    'user': 'postgres',
    'password': 'newpassword',
    'host': 'localhost',
    'port': '5432'
}

CHUNK_SIZE = 500  # Characters per chunk
OVERLAP = 50      # Overlap between chunks

def chunk_text(text, chunk_size=CHUNK_SIZE, overlap=OVERLAP):
    """Split text into overlapping chunks"""
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start = end - overlap
    
    return chunks

def process_large_articles():
    """Process and chunk large articles"""
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
    # Get articles with long descriptions
    cur.execute("""
        SELECT id, article_no, title, description 
        FROM law_articles 
        WHERE LENGTH(description) > %s
    """, (CHUNK_SIZE,))
    
    large_articles = cur.fetchall()
    print(f"Found {len(large_articles)} large articles to chunk")
    
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    for article in large_articles:
        id, article_no, title, description = article
        chunks = chunk_text(description)
        
        print(f"Article {article_no}: {len(chunks)} chunks")
        
        # For now, just use the first chunk's embedding
        # In production, you might want a separate chunks table
        text = f"{title}. {chunks[0]}"
        embedding = model.encode(text).tolist()
        
        cur.execute("""
            UPDATE law_articles 
            SET embedding = %s 
            WHERE id = %s
        """, (embedding, id))
    
    conn.commit()
    cur.close()
    conn.close()
    
    print("\n🎉 Chunking complete!")

if __name__ == "__main__":
    process_large_articles()
