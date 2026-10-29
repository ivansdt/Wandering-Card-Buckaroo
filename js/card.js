export default class Card {
    CARD_TYPE = {
        CREATURE: 'Creature',
        OBJECT: 'Object',
        SPELL: 'Spell',
    }
    CARD_STATUS = {
        DECK: 'Deck',
        GRAVEYARD: 'Graveyard',
        HAND: 'Hand',
        FIELD: 'Field',
    }
    CARD_GENRE = {
        COW_COWBOYS: 'Cow-cowboys',
        WIZARDS: 'Wizards',
        KNIGHTS: 'Knights',
    }

    constructor() {
        this.nodeCount = 1;
        this.effect;
        this.nodeSelected = false;
        this.width = 150;
        this.height = 200;
        this.genre;
        this.type;
        this.playable = true;
        this.state = this.CARD_STATUS.DECK;
        this.sprite;
        this.zone;
        this.value;
    }

}