export let dataHandler = {
    getBoards: async function () {
        return await apiGet("/api/boards");
    },
    getBoard: async function (boardId) {},
    getStatuses: async function () {
        return await fetch("/api/get_statuses");
    },
    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/cards/`);
    },
    getCard: async function (cardId) {},
    createNewBoard: async function (boardTitle) {
        return await apiPost("/api/create_board", {
            title: `${boardTitle}`,
        });
    },
    renameCurrentCard: async function (newCardName, cardId) {
        return await apiPost("/api/rename_card", {
            title: newCardName,
            card_id: cardId,
        });
    },
    renameCurrentBoard: async function (newBoardName, boardId) {
        return await apiPost("/api/rename_board", {
            title: newBoardName,
            board_id: boardId,
        });
    },
    createNewCard: async function (cardTitle, boardId, statusId, order) {
        return await apiPost("/api/create_new_card", {
            title: cardTitle,
            board_id: boardId,
            status_id: statusId,
            order: order,
        });
    },
    getStatusesByBoardId: async function (boardId) {
        return await apiGet(`/api/get_statuses/${boardId}`);
    },
    bindStatusToBoard: async function (statusId, boardId) {
        return await apiPost("/api/status_to_board", {
            board_id: boardId,
            status_id: statusId,
        });
    },
    getStatus: async function (statusId) {},
    getDefaultStatuses: async function () {
        return await apiGet("/api/get_default_statuses");
    },
    setCardOrder: async function (arrOfObj) {
        return await apiPost("/api/set_cards_order", {
            cards: arrOfObj,
        });
    },
    getUserId: async function () {
        return await apiGet("/api/get_user_id");
    },
    getBoardsByUserId: async function (userId) {
        return await apiGet(`/api/get_boards/${userId}`);
    },
    deleteBoard: async function (boardId) {
        return await apiPost("/api/delete-board", {
            board_id: boardId,
        });
    },
    deleteStatusById: async function (board_id, status_id) {
        return await apiPost("/api/delete-status", {
            board_id: board_id,
            status_id: status_id,
        });
    },
    deleteCard: async function (cardId) {
        return await apiPost(`/api/delete-card`, {
            cardId: cardId,
        });
    },
};

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200) {
        return await response.json();
    }
}

async function apiPost(url, payload) {
    let response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (response.status === 200) {
        return await response.json();
    }
}

async function apiDelete(url) {}

async function apiPut(url) {}
