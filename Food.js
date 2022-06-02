export class Food {
    constructor(environment) {
        this.environmentSize = environment;
    }

    random(snake, wall, wallMove, door) {
        let randomX = Math.floor(Math.random() * this.environmentSize.width) + 1;
        let randomY = Math.floor(Math.random() * this.environmentSize.height) + 1;
        let isConflict = false;
        if (randomX === snake.head.x && randomY === snake.head.y) {
            isConflict = true;
        }
        if (isConflict === false) {
            for (let i = 0; i < snake.body.length; i++) {
                let segment = snake.body[i];
                if (randomX === segment.x && randomY === segment.y) {
                    isConflict = true;
                    break;
                }
            }
        }
        if (wall) {
            if (isConflict === false) {
                for (let i = 0; i < wall.bricks.length; i++) {
                    let brick = wall.bricks[i];
                    if (randomX === brick.x && randomY === brick.y) {
                        isConflict = true;
                        break;
                    }
                }
            }
        }
        if (wallMove) {
            if (isConflict === false) {
                for (let i = 0; i < wallMove.bricks.length; i++) {
                    let brick = wallMove.bricks[i];
                    if (randomX === brick.x && randomY === brick.y) {
                        isConflict = true;
                        break;
                    }
                }
            }
        }
        if(door) {
            if (isConflict === false) {
                for (let i = 0; i < door.doorsIn.length; i++) {
                    let d = door.doorsIn[i];
                    if (randomX === d.x && randomY === d.y) {
                        isConflict = true;
                        break;
                    }
                }
            }
            if (isConflict === false) {
                for (let i = 0; i < door.doorsOut.length; i++) {
                    let d = door.doorsOut[i];
                    if (randomX === d.x && randomY === d.y) {
                        isConflict = true;
                        break;
                    }
                }
            }
        }
        if (isConflict === true) {
            this.random(snake, wall, wallMove);
        } else {
            this.x = randomX;
            this.y = randomY;
        }
    }

    spawn(snake, gameBoard, wall, wallMove, door) {
        this.delete();
        this.random(snake, wall, wallMove, door);
        this.draw(gameBoard);
    }

    draw(gameBoard) {
        let foodElement = document.createElement("div");
        $(foodElement).css({
            "grid-column-start": this.x,
            "grid-row-start": this.y
        });
        foodElement.classList.add("food");
        gameBoard.getBoard().append(foodElement);
    }

    delete() {
        $("#game-board .food").remove();
    }
}