export class Snake {
    constructor(speed, head, environmentSize, direction) {
        this.speed = speed;
        this.head = head;
        this.enviromentSize = environmentSize;
        this.body = [];
        this.tail = {};
        this.direction = direction;
        this.lastDirection = direction;
        this.head.direction = direction;
        this.reverseDirection = false;
        this.isThroughWall = false;
        this.isDie = false;
        this.createBody(2);
    }

    convertDirection(direction) {
        if (direction === "UP") return [0, -1]
        else if (direction === "LEFT") return [-1, 0]
        else if (direction === "DOWN") return [0, 1]
        else return [1, 0]

    }

    createBody(numOfSegment) {
        const convertDirection = this.convertDirection(this.lastDirection);
        this.body.push({
            x: this.head.x + (-1 * convertDirection[0]),
            y: this.head.y + (-1 * convertDirection[1]),
            direction: this.head.direction
        });
        for (let i = 0; i < numOfSegment - 1; i++) {
            this.body.push({
                x: this.body[i].x + (-1 * convertDirection[0]),
                y: this.body[i].y + (-1 * convertDirection[1]),
                direction: this.head.direction
            });
        }
    }

    draw(gameBoard) {
        let snakeHeadElement = document.createElement("div");
        $(snakeHeadElement).css({
            "grid-column-start": this.head.x,
            "grid-row-start": this.head.y
        })
        snakeHeadElement.classList.add("snake-head");
        if (this.lastDirection === "LEFT") {
            snakeHeadElement.classList.add("head-left");
        } else if (this.lastDirection === "UP") {
            snakeHeadElement.classList.add("head-up");
        } else if (this.lastDirection === "RIGHT") {
            snakeHeadElement.classList.add("head-right");
        } else {
            snakeHeadElement.classList.add("head-down");
        }
        gameBoard.getBoard().append(snakeHeadElement);
        // draw body snake
        this.body.forEach((segment, index) => {
            let snakeBodyElement = document.createElement("div");
            $(snakeBodyElement).css({
                "grid-column-start": segment.x,
                "grid-row-start": segment.y
            })
            if (index === this.body.length - 1) {
                snakeBodyElement.classList.add("snake-body-tail");
            } else {
                snakeBodyElement.classList.add("snake-body-segment");
            }
            if (segment.direction === "LEFT") {
                snakeBodyElement.classList.add("body-left");
            } else if (segment.direction === "UP") {
                snakeBodyElement.classList.add("body-up");
            } else if (segment.direction === "RIGHT") {
                snakeBodyElement.classList.add("body-right");
            } else {
                snakeBodyElement.classList.add("body-down");
            }
            gameBoard.getBoard().append(snakeBodyElement);
        })
    }

    getDirection(direction) {
        switch (direction) {
            case "LEFT":
                return "LEFT";
            case "RIGHT":
                return "RIGHT";
            case "UP":
                return "UP";
            case "DOWN":
                return "DOWN";
        }
    }

    move() {
        //move body
        // gan phan than hien tai bang phan than phia truoc
        if (!this.isDie) {
            this.lastDirection = this.direction;
            this.tail.x = this.body[this.body.length - 1].x;
            this.tail.y = this.body[this.body.length - 1].y;
            for (let i = this.body.length - 1; i >= 0; i--) {
                if (i === 0) {
                    this.body[0].x = this.head.x;
                    this.body[0].y = this.head.y;
                    this.body[0].direction = this.getDirection(this.head.direction);
                } else {
                    this.body[i].x = this.body[i - 1].x;
                    this.body[i].y = this.body[i - 1].y;
                    this.body[i].direction = this.getDirection(this.body[i - 1].direction);
                }
            }
            // move head
            const convertDirection = this.convertDirection(this.lastDirection);
            this.head.x = this.head.x + convertDirection[0];
            this.head.y = this.head.y + convertDirection[1];
            this.head.direction = this.lastDirection;
            if (this.head.x > this.enviromentSize.width) {
                this.head.x = 1;
            }
            if (this.head.x < 1) {
                this.head.x = this.enviromentSize.width;
            }
            if (this.head.y > this.enviromentSize.height) {
                this.head.y = 1;
            }
            if (this.head.y < 1) {
                this.head.y = this.enviromentSize.height;
            }
        }
    }

    delete() {
        $("#game-board .snake-head").remove();
        $("#game-board .snake-body-segment").remove();
        $("#game-board .snake-body-tail").remove();
    }

    redirect(direction) {
        if (this.reverseDirection) {
            if (direction === "UP") direction = "DOWN"
            else if (direction === "DOWN") direction = "UP"
            else if (direction === "LEFT") direction = "RIGHT"
            else if (direction === "RIGHT") direction = "LEFT"

        }
        if (this.lastDirection === "UP" && direction !== "DOWN") {
            this.direction = direction;
        } else if (this.lastDirection === "LEFT" && direction !== "RIGHT") {
            this.direction = direction;
        } else if (this.lastDirection === "DOWN" && direction !== "UP") {
            this.direction = direction;
        } else if (this.lastDirection === "RIGHT" && direction !== "LEFT") {
            this.direction = direction;
        }
    }

    grownUp() {
        const convertDirection = this.convertDirection(this.lastDirection);
        const lastSegment = this.body[this.body.length - 1];
        let x = lastSegment.x + (-1 * convertDirection[0]);
        let y = lastSegment.y + (-1 * convertDirection[1]);
        if (y > this.enviromentSize.width) {
            y = 1;
        }
        if (y < 1) {
            y = Number.parseInt(this.enviromentSize.width);
        }
        if (x > this.enviromentSize.height) {
            x = 1;
        }
        if (x < 1) {
            x = Number.parseInt(this.enviromentSize.Height);
        }
        this.body.push({x, y});
    }

    checkEat(food) {
        if (this.head.x === food.x && this.head.y === food.y) {
            return true;
        }
    }

    checkBound() {
        for (let i = 0; i < this.body.length; i++) {
            if (this.head.x === this.body[i].x && this.head.y === this.body[i].y) {
                this.isDie = true;
                break;
            }
        }
        return this.isDie;
    }

    checkHitWall(wall) {
        if (!this.isThroughWall) {
            let bricks = wall.bricks;
            for (let i = 0; i < bricks.length; i++) {
                if (this.head.x === bricks[i].x && this.head.y === bricks[i].y) {
                    this.isDie = true;
                    break;
                }
            }
        }
        return this.isDie;
    }

    bodyConflictWall(wallMove) {
        if (!this.isThroughWall) {
            let bricks = wallMove.bricks;
            for (let i = 0; i < this.body.length; i++) {
                for (let j = 0; j < bricks.length; j++) {
                    if (this.body[i].x === bricks[j].x && this.body[i].y === bricks[j].y) {
                        this.isDie = true;
                        break;
                    }
                }
                if (this.isDie) break;
            }
        }
        return this.isDie;
    }

    throwWall() {
        this.isThroughWall = true;
        setTimeout(() => {
            this.isThroughWall = false;
        }, 5000);
    }

    speedUp() {
        this.speed += 0.05;
    }
}