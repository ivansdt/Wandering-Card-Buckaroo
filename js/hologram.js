export default class Hologram {
    static HOLO_STATE = {
        IDLE: "Idle",
        BOOSTED: "Boosted",
    }

    constructor() {
        this.sprite = new Image();
        this.sizeX = 50;
        this.sizeY = 50;
    }
}