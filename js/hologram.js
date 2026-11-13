import Player from './player.js';

export default class Hologram {
    static HOLO_STATE = {
        IDLE: "Idle",
        BOOSTED: "Boosted",
    }

    constructor() {
        this.sprite = new Image();
        this.x;
        this.y;
        this.sizeX = 70;
        this.sizeY = 70;
        this.scaleX = 1.0;
        this.scaleY = 1.0;
        this.idleTimer = Math.random() * Math.PI * 2;
    }

    Update(dt) {
        this.idleTimer += dt * 3.5;

        let breathe = Math.sin(this.idleTimer) * 0.035;
        this.scaleY = 1.0 + breathe;
        this.scaleX = 1.0 - breathe * 0.5;
    }

    Draw(ctx, ent) {
        if (ent instanceof Player) {
            ctx.save();
            //ctx.translate(this.x  - (this.scaleX * 10), this.y);
            //console.log(this.scaleY);
            ctx.drawImage(this.sprite, this.x + (this.sizeX - (this.sizeX * this.scaleX)) / 2, this.y + (this.sizeY - (this.sizeY * this.scaleY)), this.sizeX * this.scaleX, this.sizeY * this.scaleY);
            ctx.restore();
        } else {
            ctx.save();
            ctx.translate(this.x + (this.sizeX - (this.sizeX * this.scaleX)) / 2, this.y + (this.sizeY - (this.sizeY * this.scaleY)));
            ctx.scale(-1, 1);
            ctx.drawImage(this.sprite, 0, 0, this.sizeX * this.scaleX, this.sizeY * this.scaleY);
            ctx.restore();
        }
    }
}