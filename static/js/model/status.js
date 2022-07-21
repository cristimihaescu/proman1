import util from "../util/util.js";
import {dataHandler} from "../data/dataHandler.js";
import {addNewCard, initContainerForDragEvents} from "./cards.js";

export {createStatusBoxes, addNewStatus, renameColumn, deleteStatus};

async function addNewStatus(e) {
    const boardId = e.target.dataset.boardId;
    const statusWrapper = document.querySelector(`.status-container[data-board-id="${boardId}"]`);
    const newStatus = createStatusBoxes({title: "", id: "pending-id"}, boardId);
    await util.wait(1);
    statusWrapper.appendChild(newStatus);
    newStatus.querySelector(".status-headline").innerHTML = util.createNewInput("status_name", "create-new-status-name");
    const myInput = document.querySelector("#create-new-status-name");
    myInput.addEventListener("keydown", handleInputSaveStatus);
    myInput.focus();
    util.wait(1).then(() => document.body.addEventListener("click", clickOutsideStatus));
}

// more of a html factory function
function createStatusBoxes(statusData, boardId) {
    const statusBox = document.createElement("div");
    statusBox.classList.add("status-box");
    statusBox.dataset.statusId = statusData.id;
    statusBox.dataset.boardId = boardId;
    statusBox.innerHTML = ` <p class="status-headline" data-board-id="${boardId}" data-status-id="${statusData.id}">${statusData.title}</p>
                           <p class="delete-status" data-board-id="${boardId}" data-status-id="${statusData.id}">Delete Column</p>
                           <p class="new-card-link" data-board-id="${boardId}" data-status-id="${statusData.id}">Add new card</p>
                           <div class="status-col" data-status-id="${statusData.id}" data-board-id="${boardId}"></div>`;
    return statusBox;
}

//TODO: refactor combine with the cards and board
async function handleInputSaveStatus(e) {
    const boardId = document.querySelector('.status-box[data-status-id="pending-id"]').dataset.boardId;
    const myInput = document.querySelector("#create-new-status-name");
    if (e.key === "Escape") {
        removeStatusBox(myInput, `.status-box[data-status-id="pending-id"]`, clickOutsideStatus);
    }
    if (e.key === "Enter") {
        const newName = e.currentTarget.value;
        if (newName.length < 1) {
            e.currentTarget.classList.add("error");
            myInput.closest("div").classList.add("error");
        } else {
            await setUpNewStatusListeners(myInput, newName, boardId);
        }
    }
}

async function setUpNewStatusListeners(myInput, newName, boardId) {
    const cardHolder = myInput.closest("div").querySelector(".status-col");
    const addNewCardBtn = myInput.closest("div").querySelector(".new-card-link");
    const deleteStatusBtn = myInput.closest("div").querySelector(".delete-status");
    const statusResponse = await dataHandler.createNewStatus(newName);
    const newStatus = await statusResponse.json();
    myInput.closest("div").classList.remove("error");
    addNewCardBtn.addEventListener("click", addNewCard);
    await dataHandler.bindStatusToBoard(newStatus.id, boardId);
    myInput.closest("p").textContent = newName;
    setStatusData(newStatus, "pending-id");
    deleteStatusBtn.addEventListener('click', deleteStatus);
    initContainerForDragEvents(cardHolder);
    document.body.removeEventListener("click", clickOutsideStatus);
    renameColumn();
}

function removeStatusBox(element, parentString, callBack) {
    const parentDiv = element.closest(parentString);
    parentDiv.remove();
    document.body.removeEventListener("click", callBack);
}

function clickOutsideStatus(e) {
    const clickTarget = document.querySelector("#create-new-status-name");
    if (e.target !== clickTarget) {
        removeStatusBox(clickTarget, ".status-box", clickOutsideStatus);
    }
}

function setStatusData(statusData, pendingStatusId) {
    const newStatus = document.querySelector(`.status-box[data-status-id='${pendingStatusId}']`);
    const statusHeadline = newStatus.querySelector(".status-headline");
    const statusLink = newStatus.querySelector(".new-card-link");
    const statusCol = newStatus.querySelector(".status-col");
    const deleteStatus = newStatus.querySelector(".delete-status")
    newStatus.dataset.statusId = statusData.id;
    statusHeadline.dataset.statusId = statusData.id;
    statusLink.dataset.statusId = statusData.id;
    statusCol.dataset.statusId = statusData.id;
    deleteStatus.dataset.statusId = statusData.id;
}


function renameColumn() {
    const columns = document.querySelectorAll('.status-headline');
    columns.forEach(column => column.addEventListener('click', handleRenameColumn));
}


function handleRenameColumn(event) {
    const column = event.currentTarget;
    const columnId = column.attributes[2].value;
    const boardId = column.attributes[1].value;
    column.removeEventListener('click', handleRenameColumn);
    const currentName = column.innerHTML;
    column.innerHTML = `<input value="${currentName}"type="text" name="column_name" id="rename_the_column">`;
    let currentInput = document.getElementById('rename_the_column');
    currentInput.focus();
    const fnc = handleWrapper(currentName, column);
    util.wait(100).then(() => document.body.addEventListener('click', fnc));
    checkColumnName(currentInput, columnId, boardId, column, fnc);
}


function handleWrapper(currentName, column) {
    function handleRenameClickOutside(e) {
        const inputField = document.querySelector('#rename_the_column');
        if (e.target !== inputField) {
            column.innerHTML = currentName;
            document.body.removeEventListener('click', handleRenameClickOutside);
            column.addEventListener('click', handleRenameColumn);
            column.parentNode.classList.remove("error");
        }
    }
    return handleRenameClickOutside;
}


function checkColumnName(currentInput, columnId, boardId, column, fnc) {
    currentInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            const newColumnName = e.currentTarget.value;
            if (newColumnName.length < 1) {
                column.parentNode.classList.add('error');
            } else {
                column.parentNode.classList.remove('error');
                e.currentTarget.parentNode.textContent = newColumnName;
                const defaultColumns = ['1', '2', '3', '4'];
                if (defaultColumns.includes(columnId)) {
                    document.body.removeEventListener('click', fnc);
                    const statusData = await dataHandler.createNewStatus(newColumnName);
                    const newStatusNameData = await statusData.json();
                    await dataHandler.updateStatusInStatusBoard(newStatusNameData.id, columnId, boardId);
                    setStatusData(newStatusNameData, columnId);
                    column.addEventListener('click', handleRenameColumn);
                } else {
                    document.body.removeEventListener('click', fnc);
                    await dataHandler.updateStatusTitle(columnId, newColumnName);
                    column.addEventListener('click', handleRenameColumn);
                }
            }
        }
    });
}

async function deleteStatus(e){
    const boardId = e.currentTarget.dataset.boardId;
    const statusId = e.currentTarget.dataset.statusId;
    const link = e.currentTarget;
    const parent = link.closest(".status-box");
    const deleteData = await dataHandler.deleteStatusById(boardId, statusId);
    console.log(deleteData);
    if(deleteData){
        parent.remove()
    }
}