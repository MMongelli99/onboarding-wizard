from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
import sqlite3
from typing import Optional, Dict, Any

app = Flask(__name__)
CORS(app, origins="http://localhost:5173")

DATABASE_FILE = "db.sqlite3"

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
    elif query_.startswith('PRAGMA'):
        result = cursor.fetchall()
    else:
        raise Exception(f"Define how to handle this query: {query}")

    conn.close()
    return result

@app.route("/api/data", methods=['GET'])
@cross_origin(origins="http://localhost:5173")
def database_json():
    tables = query_db("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    table_names = [row["name"] for row in tables]

    output = {}
    for table in table_names:
        output[table] = {
            "rows": query_db(f"SELECT * FROM {table}"),
            "columns": [col["name"] for col in query_db(f"PRAGMA table_info({table})")],
        }

    print(output)
    return jsonify(output)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
    # result = query_db(
    #     """
    #     INSERT INTO users 
    #     (
    #         email_address,
    #         password
    #         -- birthdate,
    #         -- address,
    #         -- about_me
    #     )
    #     VALUES
    #     (
    #         :email_address,
    #         :password
    #         -- :birthdate,
    #         -- :address,
    #         -- :about_me
    #     )
    #     """,
    #     {
    #         "email_address": "mike@zealthy.com",
    #         "password": "1234"
    #         # birthdate,
    #         # address,
    #         # about_me
    #     },
    # )
    # print(result)
    # print(query_db('SELECT * FROM users'))
