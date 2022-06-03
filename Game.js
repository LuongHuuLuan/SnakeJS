import {GameBoard} from "./GameBoard.js";
import {Snake} from "./Snake.js";
import {Food} from "./Food.js";
import {Wall} from "./Wall.js";
import {WallMove} from "./WallMove.js";
import {Item} from "./Item.js";
import {Door} from "./Door.js";
import {MyGameLoop} from "./MyGameLoop.js";

export class Game {
    GAME_WIDTH = 25;
    GAME_HEIGHT = 15;
    SCORE = 0;
    GOAL = 200;
    level = 1;
    mode = 1;
    eatAudio = new Audio("./audios/eat.mp3");
    dieAudio = new Audio("./audios/gameOver.mp3");
    winAudio = new Audio("./audios/win.mp3");
    isMute = true;

    constructor() {
        this.setUp();
        this.handleEvent();
    }

    setUp() {
        this.foodEaten = 0;
        this.SCORE = 0;
        this.isPlaying = false;
        this.isWin = false;
        this.gameBoard = new GameBoard(this.GAME_WIDTH, this.GAME_HEIGHT);
        this.snake = new Snake(2, {x: 10, y: 5}, {width: this.GAME_WIDTH, height: this.GAME_HEIGHT}, "LEFT");
        this.snake.isDie = false;
        this.food = new Food({width: this.GAME_WIDTH, height: this.GAME_HEIGHT});
        this.gameLoop = new MyGameLoop("Interval");
        this.itemLoop = new MyGameLoop();
        this.wallMoveLoop = new MyGameLoop("Interval");
        switch (this.level) {
            case 1:
                this.level1();
                break;
            case 2:
                this.level2();
                break;
            case 3:
                this.level3();
                break;
            case 4:
                this.level4();
                break;
            case 5:
                this.level5();
                break;
            default:
                break;
        }
        this.setInformationStage();
    }

    play() {
        if (!this.isPlaying && !this.snake.isDie && !this.isWin) {
            this.isPlaying = true;
            this.gameLoop.loop(() => {
                this.playing()
            }, 500 / this.snake.speed);
            if (this.wallMove) {
                this.wallMoveLoop = new MyGameLoop("Interval");
                this.wallMoveLoop.loop(() => {
                    this.wallMove.move(this.gameBoard, this.snake);
                    this.wallMove.delete();
                    this.wallMove.draw(this.gameBoard);
                }, 500 / this.wallMove.speed);
            }
            if (this.item && !this.item.hide) {
                this.itemLoop.resume();
            }
        }
    }

    pause() {
        if (this.isPlaying && !this.isWin) {
            this.isPlaying = false;
            this.gameLoop.pause();
            if (this.wallMove) {
                this.wallMoveLoop.pause();
            }
            if (this.item && !this.item.hide) {
                this.itemLoop.pause();
            }
        }
    }

    restart() {
        $(".main-screen .game .restart").css("display", "none");
        this.stage(this.level);
    }

    changeSpeed() {
        this.gameLoop.clear();
        this.gameLoop.loop(() => {
            this.playing()
        }, 500 / this.snake.speed);
    }

    playing() {
        if (this.door) {
            this.door.translate(this.snake, this.wall);
        }
        this.snake.move();
        if (!this.snake.isDie) {
            this.snake.checkBound();
            if (this.wall)
                this.snake.checkHitWall(this.wall);
            if (this.wallMove) {
                this.snake.checkHitWall(this.wallMove);
                this.snake.bodyConflictWall(this.wallMove);
            }
            if (!this.snake.isDie) {
                this.snake.delete();
                this.snake.draw(this.gameBoard);
            }
        } else {
            if (!this.isMute)
                this.dieAudio.play();
            this.pause();
            $(".main-screen .game .restart").css("display", "block");
        }
        if (this.snake.checkEat(this.food)) {
            if (!this.isMute) {
                this.eatAudio.play();
            }
            if (this.item && this.item.hide) {
                this.foodEaten = (this.foodEaten + 1) % 3;
                if (this.foodEaten === 2) {
                    this.item.spawn(this.snake, this.gameBoard, this.food, this.wall, this.wallMove, this.door);
                    this.itemLoop.loop(() => {
                        this.item.delete();
                        this.item.isHide();
                        this.itemLoop.clear();
                    }, 5000);
                }
            }
            this.SCORE += 10;
            this.snake.speedUp();
            this.changeSpeed();
            this.snake.grownUp();
            this.food.spawn(this.snake, this.gameBoard, this.wall, this.wallMove, this.door);
            $(".score span").text(this.SCORE);
        }
        if (this.item) {
            if (this.snake.checkEat(this.item) && !this.snake.isDie) {
                if (!this.isMute) {
                    this.eatAudio.play();
                }
                this.item.effect(this.snake);
                this.changeSpeed();
                this.itemLoop.clear();
                this.item.delete();
                this.item.isHide();
                this.foodEaten = 0;
            }
        }
        if (this.SCORE === this.GOAL && this.mode === 1) {
            if (!this.isMute) {
                this.winAudio.play();
            }
            $(".main-screen .game .next-stage").css("display", "block");
            this.pause();
            this.isWin = true;
            this.level++;
        }
    }

    stage(level) {
        this.level = level;
        if (this.level > 5) {
            this.level = 1;
        }
        this.gameLoop.clear();
        this.snake.delete();
        this.food.delete();
        if (this.wall)
            this.wall.delete();
        if (this.wallMove) {
            this.wallMove.delete();
            this.wallMoveLoop.clear();
        }
        if (this.item) {
            this.item.delete();
            this.itemLoop.clear();
        }
        if (this.door) {
            this.door.delete();
        }
        this.setUp();
        this.snake.draw(this.gameBoard);
        this.food.spawn(this.snake, this.gameBoard, this.wall, this.wallMove, this.door);
    }

    setInformationStage() {
        if (this.mode === 1) {
            $(".main-screen .game-info .goal").css("display", "block");
        } else {
            $(".main-screen .game-info .goal").css("display", "none");
        }
        $(".main-screen .game-info .level span").text(this.level);
        $(".main-screen .game-info .score span").text(this.SCORE);
        $(".main-screen .game-info .goal span").text(this.GOAL);
    }

    handleEvent() {
        let _this = this;
        $(document).keydown(function (e) {
            switch (e.key) {
                case "ArrowUp":
                    _this.snake.redirect("UP");
                    break;
                case "ArrowLeft":
                    _this.snake.redirect("LEFT");
                    break;
                case "ArrowDown":
                    _this.snake.redirect("DOWN");
                    break;
                case "ArrowRight":
                    _this.snake.redirect("RIGHT");
                    break;
                case " ":
                    if (_this.isPlaying) {
                        _this.pause();
                    } else {
                        _this.play();
                    }
                    break;
                case "Enter":
                    if (_this.snake.isDie) {
                        _this.restart();
                    }
                    if (_this.isWin) {
                        _this.stage(_this.level);
                        $(".main-screen .game .next-stage").css("display", "none");
                    }
                    break;
                default:
                    break;
            }
        })
        $(".main-screen .game .fa-circle-play").click(function () {
            _this.play();
        })
        $(".main-screen .game .fa-circle-pause").click(function () {
            _this.pause();
        })
        $(".main-screen .game .restart").click(function () {
            _this.restart();
        })
        $(".main-screen .game .next-stage .btn-next").click(() => {
            _this.stage(_this.level);
            $(".main-screen .game .next-stage").css("display", "none");
        })
    }

    displayInfo() {
        let snakeHeadInfo = $(".snake-head-info");
        let snakeBodyInfo = $(".snake-info");
        let foodInfo = $(".food-info");
        let wallInfo = $(".wall-info");
        let wallMoveInfo = $(".wall-move-info");
        let itemSpeedUpInfo = $(".item-speed-up-info");
        let itemSpeedLowInfo = $(".item-speed-low-info");
        let itemReverseInfo = $(".item-reverse-info");
        let itemThroughWallInfo = $(".item-through-wall-info");
        let doorInfo = $(".door-info");
        switch (this.level) {
            case 1:
                snakeHeadInfo.css("display", "flex");
                snakeBodyInfo.css("display", "flex");
                foodInfo.css("display", "flex");
                wallInfo.css("display", "none");
                wallMoveInfo.css("display", "none");
                itemSpeedUpInfo.css("display", "none");
                itemSpeedLowInfo.css("display", "none");
                itemReverseInfo.css("display", "none");
                itemThroughWallInfo.css("display", "none");
                doorInfo.css("display", "none");
                break;
            case 2:
                snakeHeadInfo.css("display", "flex");
                snakeBodyInfo.css("display", "flex");
                foodInfo.css("display", "flex");
                wallInfo.css("display", "flex");
                wallMoveInfo.css("display", "none");
                itemSpeedUpInfo.css("display", "none");
                itemSpeedLowInfo.css("display", "none");
                itemReverseInfo.css("display", "none");
                itemThroughWallInfo.css("display", "none");
                doorInfo.css("display", "none");
                break;
            case 3:
                snakeHeadInfo.css("display", "flex");
                snakeBodyInfo.css("display", "flex");
                foodInfo.css("display", "flex");
                wallInfo.css("display", "flex");
                wallMoveInfo.css("display", "flex");
                itemSpeedUpInfo.css("display", "none");
                itemSpeedLowInfo.css("display", "none");
                itemReverseInfo.css("display", "none");
                itemThroughWallInfo.css("display", "none");
                doorInfo.css("display", "none");
                break;
            case 4:
                snakeHeadInfo.css("display", "flex");
                snakeBodyInfo.css("display", "flex");
                foodInfo.css("display", "flex");
                wallInfo.css("display", "flex");
                wallMoveInfo.css("display", "flex");
                itemSpeedUpInfo.css("display", "flex");
                itemSpeedLowInfo.css("display", "flex");
                itemReverseInfo.css("display", "flex");
                itemThroughWallInfo.css("display", "flex");
                doorInfo.css("display", "none");
                break;
            case 5:
                snakeHeadInfo.css("display", "flex");
                snakeBodyInfo.css("display", "flex");
                foodInfo.css("display", "flex");
                wallInfo.css("display", "flex");
                wallMoveInfo.css("display", "flex");
                itemSpeedUpInfo.css("display", "flex");
                itemSpeedLowInfo.css("display", "flex");
                itemReverseInfo.css("display", "flex");
                itemThroughWallInfo.css("display", "flex");
                doorInfo.css("display", "flex");
                break;
            default:
                break;
        }
    }

    level1() {
        this.GOAL = 200;
        this.snake.draw(this.gameBoard);
        this.food.spawn(this.snake, this.gameBoard);
        this.wall = null;
        this.wallMove = null
        this.item = null;
        this.door = null;
        this.displayInfo();
    }

    level2() {
        this.GOAL = 250;
        this.wall = new Wall([]);
        this.wallMove = null
        this.item = null;
        this.door = null;
        for (let i = 1; i <= this.GAME_WIDTH; i++) {
            for (let j = 1; j <= this.GAME_HEIGHT; j++) {
                if (i === 1 || i === this.GAME_WIDTH || j === 1 || j === this.GAME_HEIGHT) {
                    this.wall.push({x: i, y: j})
                }
            }
        }
        this.wall.draw(this.gameBoard);
        this.snake.draw(this.gameBoard);
        this.food.spawn(this.snake, this.gameBoard, this.wall);
        this.displayInfo();
    }

    level3() {
        this.GOAL = 300;
        this.wall = new Wall([]);
        this.wallMove = new WallMove([], "RIGHT", 2);
        this.item = null;
        this.door = null;
        for (let i = 1; i <= this.GAME_WIDTH; i++) {
            for (let j = 1; j <= this.GAME_HEIGHT; j++) {
                if (i === 1 || i === this.GAME_WIDTH || j === 1 || j === this.GAME_HEIGHT) {
                    this.wall.push({x: i, y: j})
                }
                if (j === 8 && (i > 6 && i < this.GAME_WIDTH - 6)) {
                    let brick = {x: i, y: j};
                    this.wallMove.push(brick);
                }
            }
        }
        this.wall.draw(this.gameBoard);
        this.wallMove.draw(this.gameBoard);
        this.snake.draw(this.gameBoard);
        this.food.spawn(this.snake, this.gameBoard, this.wall, this.wallMove);
        this.displayInfo();
    }

    level4() {
        this.GOAL = 350;
        this.snake = new Snake(2, {x: 10, y: 6}, {width: this.GAME_WIDTH, height: this.GAME_HEIGHT}, "LEFT");
        this.wall = new Wall([]);
        this.wallMove = new WallMove([], "DOWN", 2);
        this.item = new Item({width: this.GAME_WIDTH, height: this.GAME_HEIGHT});
        this.door = null;
        let x = Math.floor(this.GAME_HEIGHT / 2);
        for (let i = 1; i <= this.GAME_WIDTH; i++) {
            for (let j = 1; j <= this.GAME_HEIGHT; j++) {
                if (i === 1 || i === this.GAME_WIDTH || j === 1 || j === this.GAME_HEIGHT) {
                    if (i === 1 || i === this.GAME_WIDTH) {
                        if (j >= x - 1 && j < x + 4) {
                            this.wallMove.push({x: i, y: j});
                        }
                    }
                }
                if ((i > 3 && i < this.GAME_WIDTH - 2) && (j === 5 || j === 11)) {
                    this.wall.push({x: i, y: j})
                }
            }
        }
        this.wall.draw(this.gameBoard);
        this.wallMove.draw(this.gameBoard);
        this.snake.draw(this.gameBoard);
        this.food.spawn(this.snake, this.gameBoard, this.wall, this.wallMove);
        this.displayInfo();
    }

    level5() {
        this.GOAL = 350;
        this.door = new Door();
        this.snake = new Snake(2, {x: 10, y: 3}, {width: this.GAME_WIDTH, height: this.GAME_HEIGHT}, "LEFT");
        this.wall = new Wall([]);
        this.wallMove = new WallMove([], "RIGHT", 2);
        this.item = new Item({width: this.GAME_WIDTH, height: this.GAME_HEIGHT});
        for (let i = 1; i <= this.GAME_WIDTH; i++) {
            for (let j = 1; j <= this.GAME_HEIGHT; j++) {
                if ((i > 3 && i < this.GAME_WIDTH - 2) && (j === 4 || j === 12)) {
                    this.wall.push({x: i, y: j})
                }
                if ((i === 3 || i === this.GAME_WIDTH - 2) && (j > 4 && j < this.GAME_HEIGHT - 3)) {
                    this.wall.push({x: i, y: j})
                }
                if ((j === 1 || j === this.GAME_HEIGHT) && (i > 6 && i < this.GAME_WIDTH - 6)) {
                    let brick = {x: i, y: j};
                    this.wallMove.push(brick);
                }
                if ((j === 4 || j === 12) && (i === 3 || i === 23)) {
                    this.door.addDoorIn({x: i, y: j});
                }
                if ((j === 5 && i === 4) || (j === 11 && i === 22) || (j === 8 && i === 15)) {
                    this.door.addDoorOut({x: i, y: j});
                }
            }
        }
        this.wall.draw(this.gameBoard);
        this.wallMove.draw(this.gameBoard);
        this.door.draw(this.gameBoard);
        this.snake.draw(this.gameBoard);
        this.food.spawn(this.snake, this.gameBoard, this.wall, this.wallMove, this.door);
        this.displayInfo();
    }

}

