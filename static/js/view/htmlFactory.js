export const htmlTemplates = {
    board: 1,
    card: 2
};

export function htmlFactory(template) {
    switch (template) {
        case htmlTemplates.board:
            return boardBuilder;
        case htmlTemplates.card:
            return cardBuilder;
        default:
            console.error("Undefined template: " + template);
            return () => {
                return "";
            };
    }
}

function boardBuilder(board) {
    return `<div class="board-container">
                <div class="board-header">
                    <div class="board" data-board-id=${board.id}>${board.title}</div>
                    <div class="board-menu-wrapper">
                        <button class="add-new-status-button invisible" data-board-id="${board.id}">Add New Status</button>
                        <button class="toggle-board-button" data-board-id="${board.id}"><i class="fas fa-chevron-down"></i></button>
                        <button class="delete-board" data-board-id="${board.id}">Delete</button>
                    </div>
                </div>
                <div class="status-container" data-board-id="${board.id}">
                    
                </div>
            </div>`;
}

function cardBuilder(card) {
    return `
    <div draggable="true" class="card" data-card-id="${card.id}"><p class="rename">${card.title}</p><i class="fas fa-trash-alt trash"></i></div>`;
}
