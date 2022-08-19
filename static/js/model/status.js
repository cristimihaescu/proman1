import util from "../util/util.js";
import { dataHandler } from "../data/dataHandler.js";
import { addNewCard, initContainerForDragEvents } from "./cards.js";

export { createStatusBoxes, addNewStatus, deleteStatus };

async function addNewStatus(e) {
    const boardId = e.target.dataset.boardId;
    const statusWrapper = document.querySelector(
        `.status-container[data-board-id="${boardId}"]`
    );
    const newStatus = createStatusBoxes(
        { title: "", id: "pending-id" },
        boardId
    );
    await util.wait(1);
    statusWrapper.appendChild(newStatus);
    newStatus.querySelector(".status-headline").innerHTML = util.createNewInput(
        "status_name",
        "create-new-status-name"
    );
    const myInput = document.querySelector("#create-new-status-name");
    myInput.addEventListener("keydown", handleInputSaveStatus);
    myInput.focus();
    util.wait(1).then(() =>
        document.body.addEventListener("click", clickOutsideStatus)
    );
}

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

async function handleInputSaveStatus(e) {
    const boardId = document.querySelector(
        '.status-box[data-status-id="pending-id"]'
    ).dataset.boardId;
    const myInput = document.querySelector("#create-new-status-name");
    if (e.key === "Escape") {
        removeStatusBox(
            myInput,
            `.status-box[data-status-id="pending-id"]`,
            clickOutsideStatus
        );
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
    const addNewCardBtn = myInput
        .closest("div")
        .querySelector(".new-card-link");
    const deleteStatusBtn = myInput
        .closest("div")
        .querySelector(".delete-status");
    const newStatus = await statusResponse.json();
    myInput.closest("div").classList.remove("error");
    addNewCardBtn.addEventListener("click", addNewCard);
    await dataHandler.bindStatusToBoard(newStatus.id, boardId);
    myInput.closest("p").textContent = newName;
    setStatusData(newStatus, "pending-id");
    deleteStatusBtn.addEventListener("click", deleteStatus);
    initContainerForDragEvents(cardHolder);
    document.body.removeEventListener("click", clickOutsideStatus);
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
    const newStatus = document.querySelector(
        `.status-box[data-status-id='${pendingStatusId}']`
    );
    const statusHeadline = newStatus.querySelector(".status-headline");
    const statusLink = newStatus.querySelector(".new-card-link");
    const statusCol = newStatus.querySelector(".status-col");
    const deleteStatus = newStatus.querySelector(".delete-status");
    newStatus.dataset.statusId = statusData.id;
    statusHeadline.dataset.statusId = statusData.id;
    statusLink.dataset.statusId = statusData.id;
    statusCol.dataset.statusId = statusData.id;
    deleteStatus.dataset.statusId = statusData.id;
}

async function deleteStatus(e) {
    const boardId = e.currentTarget.dataset.boardId;
    const statusId = e.currentTarget.dataset.statusId;
    const link = e.currentTarget;
    const parent = link.closest(".status-box");
    const deleteData = await dataHandler.deleteStatusById(boardId, statusId);
    console.log(deleteData);
    if (deleteData) {
        parent.remove();
    }
}
