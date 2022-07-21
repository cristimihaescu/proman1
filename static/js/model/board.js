import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates, formBuilder, errorBlock} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import util from "../util/util.js";
import {createStatusBoxes, addNewStatus, deleteStatus } from "./status.js";
import {showHideButtonHandler} from "../controller/boardsManager.js";
import {addNewCard, initContainerForDragEvents} from "./cards.js";

export {addNewBoard, removeBoard, renameBoard, createRegistrationWindow, handleLogout, createLoginWindow, getBoardsByUser, handleWrapper, deleteBoard};


function addNewBoard(e) {
    const targetId = e.currentTarget.id
    const boardBuilder = htmlFactory(htmlTemplates.board);
    const board = boardBuilder({"title": "", "id": "pending_board"});
    util.wait(10).then(() => {
        domManager.addChild("#root", board);
        targetId === "create_board" ? nameNewBoard() : nameNewBoard(true);
    });
}

function nameNewBoard(isPrivate=false) {
    const headline = document.querySelector('div[data-board-id="pending_board"]');
    headline.innerHTML = `<input type="text" name="board_name" id="name_new_board">`;
    const input = document.querySelector("#name_new_board");
    const handleSave = setUpHandleInputSave(isPrivate)
    input.addEventListener("keydown", handleSave);
    input.focus();
    util.wait(100).then(() => document.body.addEventListener('click', clickOutside));
}

function setUpHandleInputSave(isPrivate=false){

    async function handleInputSaveBoardName(e) {
        const board = document.querySelector('div [data-board-id="pending_board"]');
        const myInput = document.querySelector("#name_new_board");
        if (e.key === "Escape") {
            removeBoard(board);
        }
        if (e.key === "Enter") {
            const newName = e.currentTarget.value;
            if (newName.length < 1) {
                e.currentTarget.classList.add("error");
                myInput.closest("div").classList.add("error");
            } else {
                const boardData = await createNewBoard(newName, myInput, board);
                isPrivate ? await dataHandler.setBoardToPrivate(boardData.id, await dataHandler.getUserId()) : "";
            }
        }
    }
   return handleInputSaveBoardName
}


async function createNewBoard(newName, myInput, board){
    const newBoardButton = document.querySelector('button[class="toggle-board-button"][data-board-id="pending_board"]');
    const newStatusButton = document.querySelector('.add-new-status-button[data-board-id="pending_board"]');
    const newDeleteButton = document.querySelector('.delete-board[data-board-id="pending_board"]');
    myInput.closest("div").classList.remove("error");
    const boardDataResponse = await dataHandler.createNewBoard(newName);
    await setNewBoardData(board, newBoardButton, newStatusButton, newDeleteButton, boardDataResponse);
    board.addEventListener('click', handleRename);
    document.body.removeEventListener("click", clickOutside);
    return boardDataResponse
}

async function setNewBoardData(board, buttonBoard, buttonStatus, buttonDelete, data) {
    const [boardId, boardName] = [data["id"], data["title"]];
    board.textContent = boardName;
    board.dataset.boardId = boardId;
    buttonBoard.dataset.boardId = boardId;
    buttonStatus.dataset.boardId = boardId;
    buttonDelete.dataset.boardId = boardId;
    board.closest(".board-container").querySelector(".status-container").dataset.boardId = boardId;
    await setStatusBaseContent(board, boardId);
}

async function setStatusBaseContent(board, boardId) {
    const myBoardContainer = board.closest(".board-container");
    const myStatusContainer = myBoardContainer.querySelector('div[class="status-container"]');
    const statusResponse = await dataHandler.getDefaultStatuses();
    const baseStatuses = await statusResponse.json();
    for (const status of baseStatuses) {
        myStatusContainer.appendChild(createStatusBoxes(status, boardId));
        await connectStatusWithBoard(status.id, boardId);
    }
    setUpBoardListeners(myBoardContainer, myStatusContainer);
}

function setUpBoardListeners(myBoardContainer, myStatusContainer){
    const boardElementsObj = getBoardElementsObj(myBoardContainer, myStatusContainer);
    setUpBoardEvents(boardElementsObj)
    myStatusContainer.classList.add("invisible");
}

function getBoardElementsObj(myBoardContainer, myStatusContainer){
    const boardObj = {addNewStatusBtn: myBoardContainer.querySelector(".add-new-status-button"),
                    toggleBStatusBtn: myBoardContainer.querySelector(".toggle-board-button"),
                    cardHandlers: myStatusContainer.querySelectorAll(".status-col"),
                    deleteButton: myBoardContainer.querySelector('.delete-board'),
                    cardLinks: myStatusContainer.querySelectorAll(".new-card-link"),
                    deleteStatusLinks: myStatusContainer.querySelectorAll(".delete-status")}
    return boardObj;
}

function setUpBoardEvents(domObj){
    domObj.cardHandlers.forEach(handler => initContainerForDragEvents(handler));
    domObj.addNewStatusBtn.addEventListener('click', addNewStatus);
    domObj.toggleBStatusBtn.addEventListener('click', showHideButtonHandler);
    domObj.deleteButton.addEventListener('click', deleteBoard);
    domObj.cardLinks.forEach(link => link.addEventListener('click', addNewCard));
    domObj.deleteStatusLinks.forEach(link => link.addEventListener('click', deleteStatus))
}

async function connectStatusWithBoard(statusId, boardId) {
    const connectionData = await dataHandler.bindStatusToBoard(statusId, boardId);
    await connectionData.json();
}

function removeBoard(board) {
    const parentDiv = board.closest(".board-container");
    parentDiv.remove();
    document.body.removeEventListener("click", clickOutside);
}

function clickOutside(e) {
    const input = document.querySelector("#name_new_board");
    if (e.target !== input) {
        removeBoard(input);
    }
}

function renameBoard() {
    const boards = document.querySelectorAll('.board');
    boards.forEach(board => board.addEventListener('click', handleRename));
}

function handleRename(event) {
    const board = event.currentTarget;
    board.removeEventListener('click', handleRename);
    const boardID = board.attributes[1].value;
    const currentName = board.innerHTML;
    board.innerHTML = `<input value="${currentName}"type="text" name="board_name" id="rename_the_board">`;
    let currentRenameInput = document.getElementById('rename_the_board');
    currentRenameInput.focus();
    const fnc = handleWrapper(currentName, board);
    util.wait(100).then(() => document.body.addEventListener('click', fnc));
    handleInputField(boardID, fnc, board);
}

function handleInputField(boardID, fnc, board) {
    document.querySelector('#rename_the_board').addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            let newBoardName = e.currentTarget.value;
            if (newBoardName.length < 1) {
                board.classList.add("error");
            } else {
                e.currentTarget.parentNode.textContent = newBoardName;
                await dataHandler.renameCurrentBoard(newBoardName, boardID);
                board.classList.remove("error");
                document.body.removeEventListener('click', fnc);
                board.addEventListener('click', handleRename);
            }
        }
    });
}

function handleWrapper(currentName, target) {
    function handleRenameClickOutside(e) {
        const inputField = document.querySelector('#rename_the_board');
        if (e.target !== inputField) {
            target.innerHTML = currentName;
            document.body.removeEventListener('click', handleRenameClickOutside);
            target.addEventListener('click', handleRename);
            target.classList.remove("error");
        }
    }
    return handleRenameClickOutside;
}

function createRegistrationWindow(){
    setUpPopupForm("Registration")
}

function createLoginWindow(){
    setUpPopupForm("Login")
}

function setUpPopupForm(useCase){
    const regPopup = formBuilder(useCase);
    document.querySelector("#root").insertAdjacentHTML("beforebegin", regPopup);
    const form = document.querySelector("form");
    const popupOuter = document.querySelector(".popup-wrapper");
    const popupBehaviour = useCase === "Registration"
        ? setUpUserForm(dataHandler.postRegistrationData, getFormErrorMessages("Registration"))
        : setUpUserForm(dataHandler.handleLogin, getFormErrorMessages("Login"));
    form.addEventListener("submit", popupBehaviour);
    popupOuter.addEventListener("click", (e)=> {
        if (e.target === popupOuter){
            document.querySelector(".popup-wrapper").remove();
        }
    })
}

function getFormErrorMessages(useCase){
   return useCase === "Registration"
       ? {firstError: "Both fields must be filled!", secondError: "This username already exists!"}
       : {firstError: "Both fields must be filled!", secondError: "The username or password is incorrect!"};
}


function setUpUserForm(callback, messageObj){
    async function handleForm(e){
        e.preventDefault();
        const [username, password] = [e.currentTarget.username, e.currentTarget.password];
        if(username.value.length < 1 || password.value.length < 1){
            handleFormError(messageObj.firstError)
        } else {
            const validUserResponse = await callback(username.value, password.value);
            const isValidUsername = await validUserResponse.json(); // after refactoring we don't need this line
            if(isValidUsername){
                document.querySelector(".popup-wrapper").remove();
                location.replace("/");
            } else {
                handleFormError(messageObj.secondError)
            }
        }
    }
    return handleForm
}


async function handleLogout(){
    await dataHandler.handleLogout();
    location.replace("/");
}

async function getBoardsByUser(){
    const isUserSignedIn = await dataHandler.getUserId();
    const boards = await dataHandler.getBoardsByUserId(isUserSignedIn);
    return boards;
}

async function deleteBoard(e){
    const boardId = e.currentTarget.dataset.boardId;
    const deleteButton = e.currentTarget;
    const boardDivToRemove = deleteButton.closest(".board-container");
    await dataHandler.deleteBoard(boardId);
    boardDivToRemove.remove()
}
