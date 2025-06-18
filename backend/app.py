from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3
from typing import Optional, Dict, Any

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

DATABASE_FILE = "db.sqlite3"
DATABASE_CONN = sqlite3.connect(DATABASE_FILE)
DATABASE_CONN.row_factory = lambda cursor, row: {
    col[0]: row[idx] for idx, col in enumerate(cursor.description)
}

def query_db(query, kwargs={}) -> Optional[Dict[str, Any], int]:
    cursor = DATABASE_CONN.execute(query, kwargs)
    DATABASE_CONN.commit()

    query_ = query.strip().upper()
    if query_.startswith('SELECT'):
        return cursor.fetchall()
    elif query_.startswith('INSERT'):
        return cursor.lastrowid
    else:
        return None

@app.route("/api/items")
def get_items():
    conn = get_db_connection()
    items = conn.execute("SELECT id, name FROM items").fetchall()
    conn.close()
    return jsonify([dict(row) for row in items])


if __name__ == "__main__":
    # app.run(debug=True)
    result = query_db(
        """
        INSERT INTO users 
        (
            email_address,
            password
            -- birthdate,
            -- address,
            -- about_me
        )
        VALUES
        (
            :email_address,
            :password
            -- :birthdate,
            -- :address,
            -- :about_me
        )
        """,
        {
            "email_address": "mike@zealthy.com",
            "password": "1234"
            # birthdate,
            # address,
            # about_me
        },
    )
    print(result)
    print(query_db('SELECT * FROM users'))
