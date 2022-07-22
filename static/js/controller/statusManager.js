import {dataHandler} from "../data/dataHandler.js";
import {createStatusBoxes, deleteStatus} from "../model/status.js";
import {cardsManager} from "./cardsManager.js";
import {addNewCard} from "../model/cards.js";

async function statusBoardManager(board) {
    const boardId = board.id;
    const boardStatuses = await dataHandler.getStatusesByBoardId(boardId);
    const myBoard = document.querySelector(`[data-board-id="${boardId}"]`).closest(".board-container");
    const myStatusContainer = myBoard.querySelector('div[class="status-container"]');
    for (const status of boardStatuses) {
        myStatusContainer.appendChild(createStatusBoxes(status, board.id));
        const addCardLinks = myStatusContainer.querySelectorAll(`.new-card-link[data-board-id="${board.id}"]`);
        const deleteStatusLinks = myStatusContainer.querySelectorAll(`.delete-status[data-board-id="${board.id}"]`)
        addCardLinks.forEach(link => link.addEventListener("click", addNewCard));
        deleteStatusLinks.forEach(link => link.addEventListener("click", deleteStatus))
    }
    myStatusContainer.classList.add("invisible");
    cardsManager.loadCards(boardId);
}

export default statusBoardManager;
