import mimetypes

from flask import Flask, render_template, url_for, request, session, redirect, escape

import queries
import util
from util import json_response

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)

app.secret_key = b'_5#y2L"F4Q8zxec]/'

#
# @app.route("/")
# def index():
#     return render_template('index.html')


@app.route("/")
def index():
    if "username" in session:
        username = escape(session["username"])
        user = queries.get_user_by_username(escape(session["username"]))
        boards=queries.get_boards()
        return render_template("index.html", name=username,boards=boards)
    return redirect(url_for('login'))


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        user = queries.get_user_by_username(username)
        if user:
            return render_template("register.html", check=3)
        queries.add_new_user(username, password)
        return render_template("register.html", check=2)
    return render_template("register.html", check=1)


@app.route("/login", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        form_email = request.form["username"]
        form_password = request.form["password"]
        user = queries.get_user_by_username(form_email)
        if not user:
            return render_template("login.html", errorMessage=True)
        if util.verify_password(form_password, user[0].get("password")):
            session["username"] = user[0].get("username")
            return redirect(url_for("index"))
        else:
            return render_template("login.html", errorMessage=True)
    return render_template("login.html", errorMessage=False)


@app.route("/logout", methods=["GET"])
def logout():
    session.pop("username", None)
    return redirect(url_for("index"))


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return queries.get_boards()


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queries.get_cards_for_board(board_id)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
