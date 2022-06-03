export class Wall {
    constructor(bricks) {
        this.bricks = bricks;
    }

    draw(gameBoard) {
        this.bricks.forEach(brick => {
            let brickElement = document.createElement("div");
            $(brickElement).css({
                "grid-column-start": brick.x,
                "grid-row-start": brick.y
            });
            brickElement.classList.add("wall");
            gameBoard.getBoard().append(brickElement);
        })
    }

    delete() {
        $("#game-board .wall").remove();

    }

    push(brick) {
        this.bricks.push(brick);
    }

    setBricks(bricks) {
        this.bricks = bricks;
    }
}