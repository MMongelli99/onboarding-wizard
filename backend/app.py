from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import sqlite3
from typing import Optional, Dict, Any

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
    elif query_.startswith('UPDATE'):
        result = cursor.lastrowid
    elif query_.startswith('PRAGMA'):
        result = cursor.fetchall()
    else:
        raise Exception(f"Define how to handle this query: {query}")

    conn.close()
    return result

app = Flask(__name__)
CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True
)

@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS")
    return response

@app.route("/api/data", methods=["GET", "OPTIONS"])
def database_json():
    tables = query_db("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    table_names = [row["name"] for row in tables]

    output = {}
    for table in table_names:
        output[table] = {
            "rows": query_db(f"SELECT * FROM {table}"),
            "columns": [col["name"] for col in query_db(f"PRAGMA table_info({table})")],
        }

    # print(output)
    return jsonify(output)

@app.route("/api/components", methods=["GET", "OPTIONS"])
def get_components():
    rows = query_db("SELECT * FROM components")
    return jsonify(rows)

@app.route("/api/components/<kind>", methods=["PATCH", "OPTIONS"])
def update_component_step(kind):
    if request.method == "OPTIONS":
        # Preflight CORS request
        return '', 204

    data = request.get_json(force=True)
    step = data.get("step")
    query_db("UPDATE components SET step = ? WHERE kind = ?", (step, kind))
    return '', 204

@app.route("/api/users", methods=["POST"])
def create_user():
    result = query_db("INSERT INTO users (email_address, password) VALUES ('','')")
    return jsonify({"id": result}), 201

@app.route("/api/users/<int:user_id>", methods=["PATCH"])
def update_user(user_id):
    data = request.get_json(force=True)
    fields = ["email_address", "password", "birthdate", "address", "about_me"]
    updates = [(key, data[key]) for key in fields if key in data]

    print("updates" , updates)

    if not updates:
        return "", 400

    for key, value in updates:
        query_db(f"UPDATE users SET {key} = ? WHERE id = ?", (value, user_id))
    return "", 204

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
