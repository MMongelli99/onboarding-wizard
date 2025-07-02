from flask import Blueprint, jsonify, request
from models import User, query_db

def get_database_json():
    tables = query_db('''
        SELECT name 
        FROM sqlite_master 
        WHERE 
            type='table' AND 
            name NOT LIKE 'sqlite_%'
    ''')
    table_names = [row["name"] for row in tables]

    output = {}
    for table in table_names:
        columns = query_db(f"PRAGMA table_info({table})")
        output[table] = {
            "rows": query_db(f"SELECT * FROM {table}"),
            "columns": [column["name"] for column in columns],
        }

    return jsonify(output)

def get_components():
    rows = query_db("SELECT * FROM components")
    return jsonify(rows)

def update_component_step(kind):
    if request.method == "OPTIONS":
        return '', 204

    data = request.get_json(force=True)
    step = data.get("step")
    query_db("UPDATE components SET step = ? WHERE kind = ?", (step, kind))
    return '', 204

def create_user(): 
    return jsonify({"id": User.create()}), 201

def update_user(user_id):
    data = request.get_json(force=True)
    fields = ["email_address", "password", "birthdate", "address", "about_me"]
    updates = [(key, data[key]) for key in fields if key in data]

    if not updates:
        return "", 400

    for key, value in updates:
        query_db(f"UPDATE users SET {key} = ? WHERE id = ?", (value, user_id))
    return "", 204

def get_user(user_id):
    rows = query_db("SELECT * FROM users WHERE id = :id", {"id": user_id})
    if not rows:
        return jsonify({"error": "User not found"}), 404
    return jsonify(rows[0])

