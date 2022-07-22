export let dataHandler = {
    getBoards: async function () {
        const response = await apiGet("/api/boards");
        return response;
    },
    getBoard: async function (boardId) {
    },
    getStatuses: async function () {
        const response = await fetch("/api/get_statuses");
        return response;

    },
    getCardsByBoardId: async function (boardId) {
        const response = await apiGet(`/api/boards/${boardId}/cards/`);
        return response;
    },
    getCard: async function (cardId) {
    },
    createNewBoard: async function (boardTitle) {
        const response = await apiPost("/api/create_board", {title: `${boardTitle}`});
        return response;
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
    bindStatusToBoard: async function (statusId, boardId) {
        const response = await fetch("/api/status_to_board", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({board_id: `${boardId}`, status_id: `${statusId}`})
        });
        return response;
    },
    getStatus: async function (statusId) {
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
