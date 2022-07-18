import data_manager
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
    # remove this code once you implement the database
    # return [{"title": "board1", "id": 1}, {"title": "board2", "id": 2}]

    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ;
        """
    )


def get_cards_for_board(board_id):
    # remove this code once you implement the database
    # return [{"title": "title1", "id": 1}, {"title": "board2", "id": 2}]

    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return matching_cards


def add_new_user(username, password):
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


def get_user_by_username(username):
    users = data_manager.execute_select("""
            SELECT *
            FROM users
             WHERE username = %(username)s""",
                                        {"username": username})
    return users
