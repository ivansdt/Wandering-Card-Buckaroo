import Card from './card.js';

export default class Zone {
    constructor() {
        this.cards = new Array(3).fill(null);
    }

    InsertCard(card) {
        this.cards.splice(card.type, 1, card);
    }
}