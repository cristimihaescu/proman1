import data_manager
from psycopg2 import sql
from util import hash_password


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})

    return status


def get_boards():
    """
    Gather all boards
    :return:
    """
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ;
        """
    )


def get_cards_for_board(board_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return matching_cards


def get_default_statuses():
    query = sql.SQL("""
        select * from statuses
        where id < 5; 
    """)
    return data_manager.execute_select(query)


def create_new_board(title):
    query = sql.SQL("""
        INSERT INTO boards
        (title)
        VALUES ( {title} )
        RETURNING id, title 
    """).format(title=sql.Literal(title))
    new_board = data_manager.execute_select(query, fetchall=False)
    return new_board


def rename_board(new_board_name, board_id):
    query = sql.SQL("""
    UPDATE boards
    SET title = {new_board_name}
    WHERE id = {board_id}
    RETURNING title, id
    """).format(new_board_name=sql.Literal(new_board_name),
                board_id=sql.Literal(board_id))
    return data_manager.execute_select(query)


def rename_card(card_id, title):
    query = sql.SQL("""
    UPDATE cards
    SET title = {title}
    WHERE id = {card_id}
    RETURNING title, id
    """).format(title=sql.Literal(title),
                card_id=sql.Literal(card_id))
    return data_manager.execute_select(query)


def get_statuses_by_board_id(board_id):
    query = sql.SQL("""
    select status_id from status_board
    where board_id = {board_id} 
    """).format(board_id=sql.Literal(board_id))
    return data_manager.execute_select(query)


def get_statuses():
    return data_manager.execute_select("""
        select * from statuses 
    """)


def get_statuses_by_status_id(arr):
    query = sql.SQL("""
        select * from statuses 
        where id = any({arr}) 
    """).format(arr=sql.Literal(arr))
    return data_manager.execute_select(query)


def connect_status_with_board(data):
    query = sql.SQL("""
        insert into status_board
        (status_id, board_id)
        values ({status_id}, {board_id})
        returning *
    """).format(status_id=sql.Literal(data["status_id"]),
                board_id=sql.Literal(data["board_id"]))
    return data_manager.execute_select(query)


def set_cards_order(cards_data):
    query = sql.SQL("""
        UPDATE cards
        SET card_order = {new_order}
        WHERE id = {id}
        RETURNING id, card_order, title 
    """).format(id=sql.Literal(cards_data["id"]),
                new_order=sql.Literal(cards_data["order"]))
    return data_manager.execute_select(query, fetchall=False)


def get_existing_user(username):
    query = sql.SQL("""
        SELECT * FROM users
        WHERE username = {username}
    """).format(username=sql.Literal(username))
    return data_manager.execute_select(query, fetchall=False)


def setNewUser(username, password):
    return data_manager.execute_select(
        """ 
        insert into users
        (username,password)
        values
        (%(username)s, %(password)s)
        RETURNING id;
        """,
        {"username": username, "password": hash_password(password)},
    )


def get_password_hash(user_id):
    query = sql.SQL("""
        SELECT password FROM users
        WHERE id = {user_id} 
    """).format(user_id=sql.Literal(user_id))
    return data_manager.execute_select(query, fetchall=False)


def get_public_boards():
    query = sql.SQL("""
        SELECT * FROM boards
        where private = false or private is null 
    """)
    return data_manager.execute_select(query)


def get_boards_by_user_id(user_id):
    query = sql.SQL("""
        SELECT * FROM boards
        WHERE private = FALSE OR  user_id = {user_id} OR private is null
    """).format(user_id=sql.Literal(user_id))
    return data_manager.execute_select(query)


def set_board_to_private(user_id, board_id):
    query = sql.SQL("""
    UPDATE boards
        SET user_id = {user_id},
            private = true
        WHERE id = {board_id} 
        RETURNING *
    """).format(user_id=sql.Literal(user_id),
                board_id=sql.Literal(board_id))
    return data_manager.execute_select(query, fetchall=False)


def delete_status_by_board_id(board_id):
    query = sql.SQL("""
        DELETE 
        FROM statuses
        WHERE statuses.id = ANY(
            SELECT status_id
            FROM status_board
            WHERE (board_id = {})) AND NOT (statuses.id = ANY({}::int[]))
            RETURNING *
    """).format(sql.Literal(board_id), sql.Literal([1, 2, 3, 4]))
    return data_manager.execute_select(query)


def delete_status_board_connection(column_id, column='board_id'):
    query = sql.SQL("""
        DELETE
        FROM status_board
        WHERE {column} = {column_id} 
        RETURNING *
    """).format(column_id=sql.Literal(column_id), column=sql.Identifier(column))
    return data_manager.execute_select(query)


def delete_status_board_connection_by_ids(board_id, status_id):
    query = sql.SQL("""
        DELETE
        FROM status_board
        WHERE board_id = {}  AND status_id = {}
        RETURNING *
    """).format(sql.Literal(board_id), sql.Literal(status_id))
    return data_manager.execute_select(query)


def delete_board_by_id(board_id):
    query = sql.SQL("""
        DELETE
        FROM boards
        WHERE id = {} 
        RETURNING id, title
    """).format(sql.Literal(board_id))
    return data_manager.execute_select(query, fetchall=False)


def delete_status_by_id(status_id):
    query = sql.SQL("""
        DELETE
        FROM statuses
        WHERE id = {}
        RETURNING id, title
    """).format(sql.Literal(status_id))
    return data_manager.execute_select(query, fetchall=False)


def delete_card(card_id):
    query = sql.SQL("""
    DELETE FROM cards
    WHERE id = {card_id}
    RETURNING id
    """).format(card_id=sql.Literal(card_id))
    return data_manager.execute_select(query, fetchall=False)
