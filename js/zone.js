import Card from './card.js';

export default class Zone {
    constructor() {
        this.cards = new Array(3).fill(null);
        this.isSelected = false;
    }

    InsertCard(card) {
        if (this.cards[card.type] == null) {
            this.cards.splice(card.type, 1, card);
            return true;
        } else {
            // console.log("space full");
            return false;
        }
    }
}