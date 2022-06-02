export class GameBoard {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.createBoard();
    }

    createBoard() {
        const _this = this;
        $(document).ready(function () {
            $("#game-board").css({
                "grid-template-rows": `repeat(${_this.height}, 1fr)`,
                "grid-template-columns": `repeat(${_this.width}, 1fr)`
            });
        })
    }

    getBoard() {
        return $("#game-board");
    }
}