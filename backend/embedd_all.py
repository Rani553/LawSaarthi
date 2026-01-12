"""
Generate Embeddings for All Articles
Uses SentenceTransformer to create vector embeddings
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

def generate_embeddings():
    """Generate embeddings for all articles in database"""
    print("Loading SentenceTransformer model...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
    # Get all articles without embeddings
    cur.execute("""
        SELECT id, article_no, title, description 
        FROM law_articles 
        WHERE embedding IS NULL
    """)
    
    articles = cur.fetchall()
    print(f"Found {len(articles)} articles to process")
    
    for article in articles:
        id, article_no, title, description = article
        
        # Combine title and description for embedding
        text = f"{title}. {description}"
        
        # Generate embedding
        embedding = model.encode(text).tolist()
        
        # Update database
        cur.execute("""
            UPDATE law_articles 
            SET embedding = %s 
            WHERE id = %s
        """, (embedding, id))
        
        print(f"✅ Article {article_no} embedded")
    
    conn.commit()
    cur.close()
    conn.close()
    
    print(f"\n🎉 Generated embeddings for {len(articles)} articles!")

if __name__ == "__main__":
    generate_embeddings()
