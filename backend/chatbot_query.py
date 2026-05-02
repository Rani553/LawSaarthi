import psycopg
import re
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

SIMILARITY_THRESHOLD = 0.75

# Keywords that signal a constitutional question
CONSTITUTION_KEYWORDS = [
    "article", "constitution", "fundamental", "right", "rights", "directive",
    "citizenship", "citizen", "migrant", "amendment", "parliament", "president",
    "governor", "judiciary", "court", "preamble", "schedule", "part", "freedom",
    "equality", "religion", "speech", "assembly", "property", "education",
    "dpsp", "writ", "habeas", "mandamus", "certiorari", "suo motu", "legislature",
    "executive", "federal", "union", "state", "emergency", "act", "law", "legal",
]

def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="lawchatbot",
        user="postgres",
        password="newpassword"
    )

def is_constitutional_question(question: str) -> bool:
    q = question.lower()
    return any(kw in q for kw in CONSTITUTION_KEYWORDS)

def query_articles(question: str) -> str:
    question_lower = question.lower().strip()

    # =====================================================
    # GUARD: Reject non-constitutional questions
    # =====================================================
    if not is_constitutional_question(question_lower):
        return "I can only answer questions related to the Indian Constitution."

    conn = get_db_connection()
    cur = conn.cursor()

    # =====================================================
    # STEP 1: Exact Article Number Match
    # Accepts: article1 / article 1 / article-1 / Article 1
    # =====================================================
    match = re.search(r'article\s*[-]?\s*(\d+[a-z]?)', question_lower)
    if match:
        article_no = match.group(1)
        cur.execute(
            "SELECT article, title, chunk FROM articles WHERE article = %s LIMIT 1;",
            (article_no,)
        )
        row = cur.fetchone()
        cur.close()
        conn.close()
        if row:
            return f"📜 **Article {row[0]}: {row[1]}**\n\n{row[2]}"
        return f"❌ Article {article_no} not found in the database."

    # =====================================================
    # STEP 2: Citizenship — short summary
    # =====================================================
    if any(word in question_lower for word in ["citizenship", "citizen", "migrant"]):
        cur.close()
        conn.close()
        return (
            "📜 **Citizenship (Part II, Articles 5–11)**\n\n"
            "**Article 5** — Citizenship at commencement: persons domiciled in India and born here or with a parent born here, or residing for 5+ years.\n\n"
            "**Article 6** — Rights of migrants from Pakistan: persons who migrated before 19 July 1948 with a parent/grandparent born in undivided India.\n\n"
            "**Article 7** — Rights of migrants to Pakistan: persons who migrated to Pakistan after 1 March 1947 but later returned on resettlement permits.\n\n"
            "**Article 8** — Rights of overseas Indians: persons or their children/grandchildren born in India (as defined by the Government of India Act 1935) who are registered by a diplomatic/consular representative.\n\n"
            "**Article 9** — No dual citizenship: a person who voluntarily acquires citizenship of a foreign state is not a citizen of India.\n\n"
            "**Article 10** — Continuance of citizenship rights subject to any law made by Parliament.\n\n"
            "**Article 11** — Parliament has the power to regulate the right of citizenship by law."
        )

    # =====================================================
    # STEP 3: Semantic Search (pgvector)
    # =====================================================
    user_embedding = model.encode(question).tolist()
    emb_str = "[" + ",".join(map(str, user_embedding)) + "]"

    cur.execute(f"""
        SELECT article, title, chunk,
               1 - (embedding <#> '{emb_str}'::vector) AS similarity
        FROM articles
        WHERE embedding IS NOT NULL
        ORDER BY embedding <#> '{emb_str}'::vector
        LIMIT 1;
    """)

    row = cur.fetchone()
    cur.close()
    conn.close()

    if row and row[3] >= SIMILARITY_THRESHOLD:
        return f"📜 **Article {row[0]}: {row[1]}**\n\n{row[2]}"

    return "❌ No relevant constitutional article found for your query. Please try rephrasing or ask about a specific article number."