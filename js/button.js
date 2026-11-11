export default class Button {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width;
        this.height;
        this.sprite = '';
        this.isSelected = false;
    }

    Draw(canvas, ctx) {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
}