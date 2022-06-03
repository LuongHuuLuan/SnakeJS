export class MyGameLoop {

    constructor(type = "TimeOut") {
        this.type = type;
    }

    loop(callback, time) {
        this.start = Date.now();
        this.callback = callback;
        this.time = time;
        this.remaining = time;
        if (this.type === "TimeOut") {
            this.ID = setTimeout(callback, time);
        } else {
            this.ID = setInterval(callback, time);
        }
    }

    pause() {
        if (this.type === "TimeOut") {
            clearTimeout(this.ID);
            this.ID = null;
            this.remaining -= (Date.now() - this.start);
        } else {
            this.clear();
        }
    }

    resume() {
        this.loop(this.callback, this.remaining);
    }

    clear() {
        if (this.type === "TimeOut") {
            clearTimeout(this.ID);
        } else {
            clearInterval(this.ID);
        }
        this.ID = null;
    }
}