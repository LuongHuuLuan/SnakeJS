export class Door {
    doorsIn = [];
    doorsOut = [];

    constructor() {

    }

    draw(gameBoard) {
        this.doorsIn.forEach(doorIn => {
            let doorInElement = document.createElement("div");
            $(doorInElement).css({
                "grid-column-start": doorIn.x,
                "grid-row-start": doorIn.y
            });
            $(doorInElement).addClass("door");
            gameBoard.getBoard().append(doorInElement);
        })
        this.doorsOut.forEach(doorOut => {
            let doorOutElement = document.createElement("div");
            $(doorOutElement).css({
                "grid-column-start": doorOut.x,
                "grid-row-start": doorOut.y
            });
            $(doorOutElement).addClass("door");
            gameBoard.getBoard().append(doorOutElement);
        })
    }

    setDoorIn(doorsIn) {
        this.doorsIn = doorsIn;
    }

    addDoorIn(doorIn) {
        this.doorsIn.push(doorIn);
    }

    setDoorOut(doorsOut) {
        this.doorsOut = doorsOut;
    }

    addDoorOut(doorOut) {
        this.doorsOut.push(doorOut);
    }

    translate(snake, wall) {
        for (let i = 0; i < this.doorsIn.length; i++) {
            if (snake.head.x === this.doorsIn[i].x && snake.head.y === this.doorsIn[i].y) {
                this.recursionRandomDoor(snake, wall, "IN");
                break;
            }
        }
        for (let i = 0; i < this.doorsOut.length; i++) {
            if (snake.head.x === this.doorsOut[i].x && snake.head.y === this.doorsOut[i].y) {
                this.recursionRandomDoor(snake, wall, "OUT");
                break;
            }
        }
    }

    recursionRandomDoor(snake, wall, direction) {
        let randomDoor;
        let tempX;
        let tempY;
        let isConflict = false;
        if (direction === "IN") {
            randomDoor = Math.floor(Math.random() * this.doorsOut.length);
            tempX = this.doorsOut[randomDoor].x + snake.convertDirection(snake.head.direction)[0];
            tempY = this.doorsOut[randomDoor].y + snake.convertDirection(snake.head.direction)[1];
        }
        if (direction === "OUT") {
            randomDoor = Math.floor(Math.random() * this.doorsIn.length);
            tempX = this.doorsIn[randomDoor].x + snake.convertDirection(snake.head.direction)[0];
            tempY = this.doorsIn[randomDoor].y + snake.convertDirection(snake.head.direction)[1];
        }
        let bricks = wall.bricks;
        for (let j = 0; j < bricks.length; j++) {
            if (tempX === bricks[j].x && tempY === bricks[j].y) {
                isConflict = true;
                break;
            }
        }
        if (!isConflict) {
            snake.head.x = tempX;
            snake.head.y = tempY;
        } else {
            this.recursionRandomDoor(snake, wall, direction);
        }
    }

    delete() {
        $("#game-board .wall").remove();
    }

}