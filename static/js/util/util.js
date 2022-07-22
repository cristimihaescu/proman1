const util = {
    wait(ms){
        return new Promise((resolve) => { return setTimeout(resolve, ms) });
},

    createNewInput(name="board_name", id="name_new_board"){
        return `<input type="text" name="${name}" id="${id}">`
    },

    removeNewElementInProgress(element, parentString, callBack){
        const parentDiv = element.closest(parentString);
        parentDiv.remove();
        document.body.removeEventListener("click", callBack);
},
}

export default util
