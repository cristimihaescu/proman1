export let dataHandler = {
    getBoards: async function () {
        const response = await apiGet("/api/boards");
        return response;
    },
    getBoard: async function (boardId) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: async function () {
        const response = await fetch("/api/get_statuses");
        return response;

        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getCardsByBoardId: async function (boardId) {
        const response = await apiGet(`/api/boards/${boardId}/cards/`);
        return response;
    },
    getCard: async function (cardId) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: async function (boardTitle) {
        // creates new board, saves it and calls the callback function with its data
        const response = await apiPost("/api/create_board", {title: `${boardTitle}`});
        return response;
    },
    setBoardToPrivate: async function (boardId, userId) {
        const response = await apiPost("/api/set_board_to_private",
            {board_id: `${boardId}`, user_id: `${userId}`});
    },
    createPrivateBoard: async function (boardTitle, userId) {
        const response = await apiPost("/api/set_private_board", {});
    },
    renameCurrentCard: async function (newCardName, cardId) {
        const response = await fetch("/api/rename_card", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title: `${newCardName}`, card_id: `${cardId}`})
        });
        return await response.json();
    },
    renameCurrentBoard: async function (newBoardName, boardId) {
        const response = await fetch("/api/rename_board", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title: `${newBoardName}`, board_id: `${boardId}`})
        });
        return await response.json();
    },
    createNewCard: async function (cardTitle, boardId, statusId, order) {
        // creates new card, saves it and calls the callback function with its data
        const response = await apiPost("/api/create_new_card", {
            title: `${cardTitle}`,
            board_id: `${boardId}`,
            status_id: `${statusId}`,
            order: `${order}`
        });
        return response;
    },
    getStatusesByBoardId: async function (boardId) {
        const response = await apiGet(`/api/get_statuses/${boardId}`);
        return response;
    },
    updateStatusTitle: async function (statusId, title) {
        const response = await fetch("/api/update_status_title", {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({status_id: `${statusId}`, title: `${title}`})
        });
        return response;
    },
    bindStatusToBoard: async function (statusId, boardId) {
        const response = await fetch("/api/status_to_board", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({board_id: `${boardId}`, status_id: `${statusId}`})
        });
        return response;
    },
    updateStatusInStatusBoard: async function (newStatusId, columnId, boardID) {
        const response = await fetch("/api/update_status_to_board", {
            method: "POST",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({new_status_id: `${newStatusId}`, column_id: `${columnId}`, board_id: `${boardID}`})
        });
        return response;
    },
    createNewStatus: async function (statusName) {
        const response = await fetch("/api/create_status", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title: `${statusName}`}),
        });
        return response;
    },
    // the statuses are retrieved and then the callback function is called with the statuses

    getStatus: async function (statusId) {
        // the status is retrieved and then the callback function is called with the status
    },
    getDefaultStatuses: async function () {
        const response = await fetch("/api/get_default_statuses");
        return response;
    },
    setCardOrder: async function (arrOfObj) {
        const response = await fetch("/api/set_cards_order", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({cards: arrOfObj})
        });
        return response;
    },
    updateCardStatus: async function (boardId, statusId, cardId) {
        const response = await fetch(`api/update_card_status/${cardId}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({board_id: `${boardId}`, status_id: `${statusId}`})
        });
        return response;
    },
    async postRegistrationData(username, password) {
        const response = await fetch("/api/registration", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: `${username}`, password: `${password}`})
        });
        return response;
    },
    async handleLogout() {
        const response = await fetch("/api/logout");
        return response;
    },
    handleLogin: async function (username, password) {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: `${username}`, password: `${password}`})
        });
        return response;
    },
    getUserId: async function () {
        const response = await apiGet("/api/get_user_id");
        return response;
    },
    getBoardsByUserId: async function (userId) {
        const response = await apiGet(`/api/get_boards/${userId}`);
        return response;
    },
    deleteBoard: async function (boardId) {
        const response = await apiPost('/api/delete-board', {"board_id": `${boardId}`})
        return response
    },
    deleteStatusById: async function (board_id, status_id) {
        const response = await apiPost('/api/delete-status',
            {
                "board_id": `${board_id}`,
                "status_id": `${status_id}`
            })
        return response
    },
    deleteCard: async function (cardId) {
        const response = await fetch(`/api/delete-card`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({cardId: `${cardId}`})
        });
        return response
    }
};

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.status === 200) {
        let data = response.json();
        return data;
    }
}

async function apiPost(url, payload) {
    let response = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
    });
    if (response.status === 200) {
        let data = response.json();
        return data;
    }
}

async function apiDelete(url) {
}

async function apiPut(url) {
}
