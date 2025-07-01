import sqlite3
from typing import Optional, Dict, Any
import os

DATABASE_FILE = "db.sqlite3"

def init_db():
    if not os.path.exists(DATABASE_FILE):
        with sqlite3.connect(DATABASE_FILE) as conn:
            with open("schema.sql") as f:
                conn.executescript(f.read())

def get_db_connection():
    conn = sqlite3.connect(DATABASE_FILE)
    conn.row_factory = lambda cursor, row: {
        col[0]: row[idx] for idx, col in enumerate(cursor.description)
    }
    return conn

def query_db(query, kwargs={}) -> Optional[Dict[str, Any] | int]:
    conn = get_db_connection()
    cursor = conn.execute(query, kwargs)
    conn.commit()

    query_ = query.strip().upper()
    result = None
    if query_.startswith('SELECT'):
        result = cursor.fetchall()
    elif query_.startswith('INSERT'):
        result = cursor.lastrowid
    elif query_.startswith('UPDATE'):
        result = cursor.lastrowid
    elif query_.startswith('PRAGMA'):
        result = cursor.fetchall()
    else:
        raise Exception(f"Define how to handle this query: {query}")

    conn.close()
    return result


