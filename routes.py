import logging
from flask import render_template
from flask import current_app as app

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def register_routes(app):
    @app.route("/")
    def home_route():
        return render_template("home.html")

    @app.route("/game")
    def game_route():
        return render_template("game.html")