export default class Input {
    constructor() {
        this.keys = new Array();
        this.nodeNumber = 0;
        this.currentCard;
        this.lastNode = 0;
    }


    /*
    OnKeyDown(e) {
        this.keys[e.key] = true;
    }
    */

    OnKeyDown(e, player) {
        if (e.key == "d") {
            if (this.nodeNumber != player.hand.length - 1) {
                this.lastNode = this.nodeNumber;
                this.nodeNumber += 1;
            } else {
                this.nodeNumber = player.hand.length - 1;
            }
            this.selecting(player.hand);
            console.log(this.nodeNumber);
            console.log("last node: " + this.lastNode);
        }

        if (e.key == "a") {
            console.log(this.nodeNumber);
            if (this.nodeNumber > 0) {
                this.lastNode = this.nodeNumber;
                this.nodeNumber -= 1;
            } else {
                this.nodeNumber = 0;
            }
            this.selecting(player.hand);
            console.log(this.nodeNumber);
            console.log("last node: " + this.lastNode);
        }
    }

    selecting(hand) {
        if (hand[this.lastNode]) {
            hand[this.lastNode].isSelected = false;
        }

        if (hand[this.nodeNumber]) {
            hand[this.nodeNumber].isSelected = true;
        }
    }
}

