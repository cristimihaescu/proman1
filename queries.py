import data_manager
from psycopg2 import sql
from util import hash_password


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    return data_manager.execute_select(
        "SELECT * FROM statuses s WHERE s.id = %(status_id)s;",
        {"status_id": status_id},
    )


def get_boards():
    """
    Gather all boards
    :return:
    """
    return data_manager.execute_select("SELECT * FROM boards;")


def get_cards_for_board(board_id):
    return data_manager.execute_select(
        "SELECT * FROM cards WHERE cards.board_id = %(board_id)s;",
        {"board_id": board_id},
    )


def get_default_statuses():
    return data_manager.execute_select("select * from statuses where id < 5;")


def create_new_board(title):
    return data_manager.execute_select(
        "INSERT INTO boards (title) VALUES (%(title)s) RETURNING id, title;",
        {"title": title},
        fetchall=False,
    )


def rename_board(new_board_name, board_id):
    return data_manager.execute_select(
        "UPDATE boards SET title = %(new_board_name)s WHERE id = %(board_id)s RETURNING title, id;",
        {"new_board_name": new_board_name, "board_id": board_id},
    )


def rename_card(card_id, title):
    return data_manager.execute_select(
        "UPDATE cards SET title = %(title)s WHERE id = %(card_id)s RETURNING title, id;",
        {"title": title, "card_id": card_id},
    )


def get_statuses_by_board_id(board_id):
    return data_manager.execute_select(
        "select status_id from status_board where board_id = %(board_id)s;",
        {"board_id": board_id},
    )


def get_statuses():
    return data_manager.execute_select("select * from statuses;")


def get_statuses_by_status_id(arr):
    return data_manager.execute_select(
        "select * from statuses where id = any(%(arr)s);",
        {"arr": arr},
    )


def connect_status_with_board(data):
    return data_manager.execute_select(
        "insert into status_board (status_id, board_id) values (%(status_id)s, %(board_id)s) returning *;",
        data,
    )


def create_new_card(data):
    return data_manager.execute_select(
        "insert into cards (board_id, status_id, title, card_order) values(%(board_id)s, %(status_id)s, %(title)s, %(order)s) returning *;",
        data,
        fetchall=False,
    )


def set_cards_order(cards_data):
    return data_manager.execute_select(
        "UPDATE cards SET card_order = %(new_order)s WHERE id = %(id)s RETURNING id, card_order, title;",
        cards_data,
        fetchall=False,
    )


def update_status_title(status_id, title):
    return data_manager.execute_select(
        "UPDATE statuses SET title = %(title)s WHERE id = %(status_id)s RETURNING *;",
        {"status_id": status_id, "title": title},
        fetchall=False,
    )


def update_card_status(data, card_id):
    return data_manager.execute_select(
        "UPDATE cards SET board_id = %(board_id)s, status_id = %(status_id)s WHERE id = %(card_id)s RETURNING *;",
        {
            "card_id": card_id,
            **data,
        },
        fetchall=False,
    )


def get_existing_user(username):
    return data_manager.execute_select(
        "SELECT * FROM users WHERE username = %(username)s;",
        {"username": username},
        fetchall=False,
    )


def setNewUser(username, password):
    return data_manager.execute_select(
        "insert into users (username,password) values (%(username)s, %(password)s) RETURNING id;",
        {"username": username, "password": hash_password(password)},
    )


def get_public_boards():
    return data_manager.execute_select("SELECT * FROM boards;")


def get_boards_by_user_id(user_id):
    return data_manager.execute_select(
        "SELECT * FROM boards user_id = %(user_id)s;",
        {"user_id": user_id},
    )


def delete_status_by_board_id(board_id):
    return data_manager.execute_select(
        """
            DELETE 
            FROM statuses
            WHERE statuses.id = ANY(
                SELECT status_id
                FROM status_board
                WHERE (board_id = %(board_id)s)) AND NOT (statuses.id = ANY(%(array)s::int[]))
            RETURNING *;
        """,
        {"board_id": board_id, "array": [1, 2, 3, 4]},
    )


def delete_status_board_connection(column_id, column="board_id"):
    return data_manager.execute_select(
        f'DELETE FROM status_board WHERE "{column}" = %(column_id)s RETURNING *;',
        {"column_id": column_id},
    )


def delete_status_board_connection_by_ids(board_id, status_id):
    return data_manager.execute_select(
        "DELETE FROM status_board WHERE board_id = {}  AND status_id = {} RETURNING *;",
        {"board_id": board_id, "status_id": status_id},
    )


def delete_board_by_id(board_id):
    return data_manager.execute_select(
        "DELETE FROM boards WHERE id = %(board_id)s RETURNING id, title;",
        {"board_id": board_id},
        fetchall=False,
    )


def delete_status_by_id(status_id):
    return data_manager.execute_select(
        "DELETE FROM statuses WHERE id = %(status_id)s RETURNING id, title;",
        {"status_id": status_id},
        fetchall=False,
    )


def delete_card(card_id):
    return data_manager.execute_select(
        "DELETE FROM cards WHERE id = %(card_id)s RETURNING id;",
        {"card_id": card_id},
        fetchall=False,
    )
