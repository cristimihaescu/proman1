from flask import Flask, render_template, url_for, request, session, redirect, escape
from dotenv import load_dotenv

from util import json_response
import util
import mimetypes
import queries

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()
app.secret_key = b'_5#y2L"F4Q8zxec]/'


@app.route("/")
def index():
    if "username" in session:
        username = escape(session["username"])
        user = queries.get_existing_user(escape(session["username"]))
        boards = queries.get_boards()
        return render_template("index.html", username=username, boards=boards)
    return redirect(url_for('login'))


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        user = queries.get_existing_user(username)
        if user:
            return render_template("register.html", check=3)
        queries.setNewUser(username, password)
        return render_template("register.html", check=2)
    return render_template("register.html", check=1)


@app.route("/login", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        form_email = request.form["username"]
        form_password = request.form["password"]
        user = queries.get_existing_user(form_email)
        if not user:
            return render_template("login.html", errorMessage=True)
        if util.verify_password(form_password, user.get("password")):
            session["username"] = request.form["username"]
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


@app.route("/api/create_board", methods=["POST"])
@json_response
def create_new_board():
    title = request.get_json()["title"]
    return queries.create_new_board(title)


@app.route("/api/rename_board", methods=["POST"])
@json_response
def rename_the_board():
    title = request.get_json()["title"]
    board_id = request.get_json()["board_id"]
    return queries.rename_board(title, board_id)


@app.route("/api/get_statuses")
@json_response
def get_statuses():
    return queries.get_statuses()


@app.route("/api/get_default_statuses")
@json_response
def get_default_statuses():
    return queries.get_default_statuses()


@app.route("/api/get_statuses/<int:board_id>")
@json_response
def get_statuses_by_id(board_id):
    status_ids = [status['status_id'] for status in queries.get_statuses_by_board_id(board_id)]
    statuses_by_name_and_id = queries.get_statuses_by_status_id(status_ids)
    return statuses_by_name_and_id


@app.route("/api/update_status_title", methods=['POST'])
@json_response
def update_status_title():
    status_id = request.get_json()["status_id"]
    title = request.get_json()["title"]
    return queries.update_status_title(status_id, title)


@app.route("/api/status_to_board", methods=["POST"])
@json_response
def bind_status_to_board():
    data = request.get_json()
    return queries.connect_status_with_board(data)


@app.route("/api/create_new_card", methods=["POST"])
@json_response
def create_new_card():
    card_data = request.get_json()
    return queries.create_new_card(card_data)


@app.route("/api/set_cards_order", methods=["PUT"])
@json_response
def set_cards_order():
    cards_data = request.get_json()["cards"]
    new_data = [queries.set_cards_order(data) for data in cards_data]
    return new_data


@app.route("/api/update_card_status/<int:card_id>", methods=["PUT"])
@json_response
def update_card_status(card_id):
    new_card_data = request.get_json()
    return queries.update_card_status(new_card_data, card_id)


@app.route("/api/rename_card", methods=["POST"])
@json_response
def update_card():
    card_id = request.get_json()["card_id"]
    new_card_name = request.get_json()["title"]
    return queries.rename_card(card_id, new_card_name)


@app.route("/api/get_user_id")
@json_response
def get_user_id():
    user_id = session.get("id")
    return user_id if user_id else -1


@app.route("/api/get_boards/<user_id>")
@json_response
def get_boards_for_user_id(user_id):
    boards = queries.get_public_boards() if user_id == "-1" else queries.get_boards_by_user_id(user_id)
    return boards


@app.route("/api/delete-board", methods=["POST"])
def delete_board():
    board_id = request.get_json()["board_id"]
    queries.delete_status_by_board_id(board_id)
    deleted_relation = queries.delete_status_board_connection(board_id)
    queries.delete_board_by_id(board_id)
    return {"deleted": deleted_relation}


@app.route("/api/delete-status", methods=["POST"])
def delete_status():
    board_id, status_id = request.get_json()["board_id"], request.get_json()["status_id"]
    deleted_relation = queries.delete_status_board_connection_by_ids(board_id, status_id)
    if int(status_id) not in [1, 2, 3, 4]:
        queries.delete_status_by_id(status_id)
    return {"relation": deleted_relation}


@app.route('/api/delete-card', methods=["POST"])
@json_response
def delete_card_from_db():
    card_id = request.get_json()["cardId"]
    return queries.delete_card(int(card_id))


def main():
    app.run(debug=True,
            port=5001)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
