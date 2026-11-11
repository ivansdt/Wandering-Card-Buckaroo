export default class Button {
    constructor(x, y, spriteOff, spriteOn) {
        this.x = x;
        this.y = y;
        this.width = 150;
        this.height = 65;
        this.sprite = new Image();
        this.spriteOff = spriteOff;
        this.spriteOn = spriteOn;
        this.isSelected = false;
    }

    Draw(canvas, ctx) {
        if (this.isSelected) {
            this.sprite.src = this.spriteOn;
        } else {
            this.sprite.src = this.spriteOff;
        }
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
}