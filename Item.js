export class Item {
    hide = true;

    constructor(environment) {
        this.environmentSize = environment;
        this.type = this.randomType();
    }

    random(snake, food, wall, wallMove, door) {
        let randomX = Math.floor(Math.random() * this.environmentSize.width) + 1;
        let randomY = Math.floor(Math.random() * this.environmentSize.height) + 1;
        let isConflict = false;
        if (randomX === food.x && randomY === food.y) {
            isConflict = true;
        }
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
                        console.log("trung")
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
            this.random(snake, food, wall, wallMove);
        } else {
            this.x = randomX;
            this.y = randomY;
        }
    }

    randomType() {
        let types = ["SPEED_UP", "SPEED_LOW", "REVERSE_DIRECTION", "THROUGH_WALL"];
        let random = Math.floor(Math.random() * types.length);
        return types[random];
    }

    spawn(snake, gameBoard, food, wall, wallMove, door) {
        this.type = this.randomType();
        this.delete();
        this.random(snake, food, wall, wallMove, door);
        this.draw(gameBoard);
        this.hide = false;
    }

    draw(gameBoard) {
        let foodElement = document.createElement("div");
        $(foodElement).css({
            "grid-column-start": this.x,
            "grid-row-start": this.y
        });
        switch (this.type) {
            case "SPEED_UP":
                foodElement.classList.add("item-speed-up");
                break;
            case "SPEED_LOW":
                foodElement.classList.add("item-speed-low");
                break;
            case "REVERSE_DIRECTION":
                foodElement.classList.add("item-reverse-direction");
                break;
            case "THROUGH_WALL":
                foodElement.classList.add("item-through_wall");
                break;
            default:
                break;
        }
        gameBoard.getBoard().append(foodElement);
    }

    delete() {
        switch (this.type) {
            case "SPEED_UP":
                $("#game-board .item-speed-up").remove();
                break;
            case "SPEED_LOW":
                $("#game-board .item-speed-low").remove();
                break;
            case "REVERSE_DIRECTION":
                $("#game-board .item-reverse-direction").remove();
                break;
            case "THROUGH_WALL":
                $("#game-board .item-through_wall").remove();
                break;
            default:
                break;
        }
    }

    isHide() {
        this.x = -1;
        this.y = -1;
        this.hide = true;
        return this.hide;
    }

    effect(snake) {
        switch (this.type) {
            case "SPEED_UP":
                snake.speed = snake.speed * 2;
                break;
            case "SPEED_LOW":
                snake.speed = snake.speed / 2;
                break;
            case "REVERSE_DIRECTION":
                snake.reverseDirection = !snake.reverseDirection;
                break;
            case "THROUGH_WALL":
                snake.throwWall();
                break;
            default:
                break;
        }
    }
}