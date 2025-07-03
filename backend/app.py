from flask import Flask, send_from_directory
from flask_cors import CORS, cross_origin
from routes import api
from models import init_db
import os

try:
    FRONTEND_ORIGIN = os.environ["FRONTEND_ORIGIN"]
except KeyError:
    raise Exception("FRONTEND_ORIGIN environment variable not set")


app = Flask(__name__, static_folder="../frontend/dist", static_url_path="")
app.register_blueprint(api)
CORS(
    app,
    resources={r"/api/*": {"origins": FRONTEND_ORIGIN}},
    supports_credentials=True
)


@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", FRONTEND_ORIGIN)
    response.headers.add("Access-Control-Allow-Credentials", "true")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS")
    return response


@app.route("/healthz")
def health_check():
    return "OK", 200


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    file_path = os.path.join(app.static_folder, path)
    if path != "" and os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


init_db()

