"""
PostgreSQL with pgvector Setup
Creates database tables and enables vector similarity search
"""

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

DB_CONFIG = {
    'dbname': 'lawchatbot',
    'user': 'postgres',
    'password': 'newpassword',
    'host': 'localhost',
    'port': '5432'
}

def setup_database():
    """Setup database with pgvector extension"""
    try:
        # Connect to postgres database first
        conn = psycopg2.connect(
            dbname='postgres',
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port']
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        
        # Create database if not exists
        cur.execute("SELECT 1 FROM pg_database WHERE datname = 'lawchatbot'")
        if not cur.fetchone():
            cur.execute("CREATE DATABASE lawchatbot")
            print("✅ Database 'lawchatbot' created")
        
        cur.close()
        conn.close()
        
        # Connect to lawchatbot database
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # Enable pgvector extension
        cur.execute("CREATE EXTENSION IF NOT EXISTS vector")
        print("✅ pgvector extension enabled")
        
        # Create law_articles table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS law_articles (
                id SERIAL PRIMARY KEY,
                article_no VARCHAR(20),
                title TEXT,
                description TEXT,
                embedding vector(384)
            )
        """)
        print("✅ law_articles table created")
        
        # Create index for faster similarity search
        cur.execute("""
            CREATE INDEX IF NOT EXISTS law_articles_embedding_idx 
            ON law_articles 
            USING ivfflat (embedding vector_cosine_ops)
            WITH (lists = 100)
        """)
        print("✅ Vector index created")
        
        conn.commit()
        cur.close()
        conn.close()
        
        print("\n🎉 Database setup complete!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    setup_database()
