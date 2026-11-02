var nodeNumber = 0;
var currentCard;
export default class Input {
    constructor() {
        this.keys = new Array();
    }



    OnKeyDown(e) {
        this.keys[e.key] = true;
    }

    mainInput() {
        if (this.keys["d"]) {
            nodeNumber += 1;
            console.log(nodeNumber);
        }

        if (this.keys["a"]) {
            nodeNumber -= 1;
            console.log(nodeNumber);
        }
    }

    selecting(hand) {
        currentCard = hand[nodeNumber];
    }
}

