"""
Insert Articles from CSV into PostgreSQL
Reads Constitution_of_India.csv and populates database
"""

import psycopg2
import csv

DB_CONFIG = {
    'dbname': 'lawchatbot',
    'user': 'postgres',
    'password': 'newpassword',
    'host': 'localhost',
    'port': '5432'
}

def insert_articles_from_csv(csv_file='Constitution_of_India.csv'):
    """Insert articles from CSV file into database"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # Clear existing data
        cur.execute("DELETE FROM law_articles")
        print("Cleared existing articles")
        
        # Read and insert from CSV
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            count = 0
            
            for row in reader:
                article_no = row.get('Article_No', row.get('article_no', ''))
                title = row.get('Title', row.get('title', ''))
                description = row.get('Description', row.get('description', ''))
                
                if article_no:
                    cur.execute("""
                        INSERT INTO law_articles (article_no, title, description)
                        VALUES (%s, %s, %s)
                    """, (article_no, title, description))
                    count += 1
                    print(f"✅ Inserted Article {article_no}")
        
        conn.commit()
        cur.close()
        conn.close()
        
        print(f"\n🎉 Inserted {count} articles successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    insert_articles_from_csv()
