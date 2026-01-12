import psycopg2
import re
from sentence_transformers import SentenceTransformer

# -----------------------------------
# Load embedding model
# -----------------------------------
model = SentenceTransformer("all-MiniLM-L6-v2")

SIMILARITY_THRESHOLD = 0.60

# -----------------------------------
# Database connection helper
# -----------------------------------
def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="lawchatbot",
        user="postgres",
        password="newpassword"
    )

# -----------------------------------
# MAIN FUNCTION (Flask will call THIS)
# -----------------------------------
def query_articles(question: str) -> str:
    conn = get_db_connection()
    cur = conn.cursor()
    question_lower = question.lower().strip()

    # =====================================================
    # STEP 1️⃣ Exact Article Number Match
    # =====================================================
    match = re.search(r'article\s+(\d+[a-z]?)', question_lower)
    if match:
        article_no = match.group(1)

        cur.execute("""
            SELECT article, title, chunk
            FROM articles
            WHERE article = %s
            LIMIT 1;
        """, (article_no,))
        row = cur.fetchone()

        if row:
            cur.close()
            conn.close()
            return f"📜 **Article {row[0]}: {row[1]}**\n\n{row[2]}"

    # =====================================================
    # STEP 2️⃣ Citizenship Articles (FULL TEXT)
    # =====================================================
    if any(word in question_lower for word in ["citizenship", "citizen", "migrant"]):
        cur.execute("""
            SELECT article, title, chunk
            FROM articles
            WHERE article IN ('5','6','7','8','9','10','11')
            ORDER BY article::int
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        if rows:
            response = "📜 **Citizenship Articles (Part II of Indian Constitution)**\n\n"
            for r in rows:
                response += f"**Article {r[0]}: {r[1]}**\n{r[2]}\n\n"
            return response
        else:
            return "❌ No citizenship articles found."

    # =====================================================
    # STEP 3️⃣ Semantic Search (pgvector)
    # =====================================================
    user_embedding = model.encode(question).tolist()
    emb_str = "[" + ",".join(map(str, user_embedding)) + "]"

    cur.execute(f"""
        SELECT article, title, chunk,
               1 - (embedding <#> '{emb_str}'::vector) AS similarity
        FROM articles
        WHERE embedding IS NOT NULL
        ORDER BY embedding <#> '{emb_str}'::vector
        LIMIT 5;
    """)

    results = cur.fetchall()
    cur.close()
    conn.close()

    # Filter only results above similarity threshold
    filtered = [r for r in results if r[3] >= SIMILARITY_THRESHOLD]

    if filtered:
        # Return the top relevant article
        row = filtered[0]
        return f"📜 **Article {row[0]}: {row[1]}**\n\n{row[2]}"

    # =====================================================
    # STEP 4️⃣ No Answer
    # =====================================================
    return "❌ No relevant constitutional article found."
