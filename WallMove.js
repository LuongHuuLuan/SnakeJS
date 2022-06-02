export class WallMove {

    constructor(bricks, direction, speed = 1) {
        this.bricks = bricks;
        this.direction = direction;
        this.speed = speed;
    }

    draw(gameBoard) {
        this.bricks.forEach(brick => {
            let brickElement = document.createElement("div");
            $(brickElement).css({
                "grid-column-start": brick.x,
                "grid-row-start": brick.y
            });
            brickElement.classList.add("wall-move");
            gameBoard.getBoard().append(brickElement);
        })
    }

    convertDirection(direction) {
        if (direction === "UP") return [0, -1]
        else if (direction === "LEFT") return [-1, 0]
        else if (direction === "DOWN") return [0, 1]
        else return [1, 0]
    }

    move(gameBoard, snake) {
        if (this.bricks.length !== 0) {
            let convertDirection = this.convertDirection(this.direction);
            let brickFirst = this.bricks[0];
            let brickLast = this.bricks[this.bricks.length - 1];
            for (let i = 0; i < snake.body.length; i++) {
                if (this.direction === "LEFT" || this.direction === "RIGHT") {
                    if (brickFirst.x - 2 === snake.body[i].x && brickLast.y === snake.body[i].y) {
                        console.log("brick: " + brickFirst.x + ", " + brickFirst.y);
                        console.log("snake: " + snake.body[i].x + ", " + snake.body[i].y);
                        console.log(this.direction)
                        this.direction = "RIGHT";
                        break;
                    }
                    if (brickLast.x + 2 === snake.body[i].x && brickLast.y === snake.body[i].y) {
                        console.log("brick: " + brickFirst.x + ", " + brickFirst.y);
                        console.log("snake: " + snake.body[i].x + ", " + snake.body[i].y);
                        console.log(this.direction)
                        this.direction = "LEFT";
                        break;
                    }
                }
                if (this.direction === "UP" || this.direction === "DOWN") {
                    if (brickFirst.y - 2 === snake.body[i].y && brickLast.x === snake.body[i].x) {
                        console.log("brick: " + brickFirst.x + ", " + brickFirst.y);
                        console.log("snake: " + snake.body[i].x + ", " + snake.body[i].y);
                        console.log(this.direction)
                        this.direction = "DOWN";
                        break;
                    }
                    if (brickLast.y + 2 === snake.body[i].y && brickLast.x === snake.body[i].x) {
                        console.log("brick: " + brickFirst.x + ", " + brickFirst.y);
                        console.log("snake: " + snake.body[i].x + ", " + snake.body[i].y);
                        console.log(this.direction)
                        this.direction = "UP";
                        break;
                    }
                }
            }
            if (this.direction === "LEFT" || this.direction === "RIGHT") {
                if (brickLast.x === gameBoard.width) {
                    this.direction = "LEFT";
                }
                if (brickFirst.x === 1) {
                    this.direction = "RIGHT";
                }
            }
            if (this.direction === "UP" || this.direction === "DOWN") {
                if (brickLast.y === gameBoard.height) {
                    this.direction = "UP";
                }
                if (brickFirst.y === 1) {
                    this.direction = "DOWN";
                }
            }
            this.bricks.forEach(brick => {
                brick.x = brick.x + convertDirection[0];
                brick.y = brick.y + convertDirection[1];
            })
            this.delete();
            this.draw(gameBoard);
        }
    }

    delete() {
        $("#game-board .wall-move").remove();
    }

    push(brick) {
        this.bricks.push(brick);
    }

    setBricks(bricks) {
        this.bricks = bricks;
    }

    changeSpeed(speed) {
        this.speed = speed;
    }
}