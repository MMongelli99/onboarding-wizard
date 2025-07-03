from flask import Blueprint
from routes import (
    get_database_json,
    get_components,
    update_component_step,
    create_user,
    update_user,
    get_user,
)

api = Blueprint("api", __name__, url_prefix="/api")

api.add_url_rule(
    "/data",
    view_func=get_database_json,
    methods=["GET"],
)

api.add_url_rule(
    "/components",
    view_func=get_components,
    methods=["GET"],
)

api.add_url_rule(
    "/components/<kind>",
    view_func=update_component_step,
    methods=["PATCH"],
)

api.add_url_rule(
    "/users",
    view_func=create_user,
    methods=["POST"],
)

api.add_url_rule(
    "/users/<int:user_id>",
    view_func=get_user,
    methods=["GET"],
)

api.add_url_rule(
    "/users/<int:user_id>",
    view_func=update_user,
    methods=["PATCH"],
)
