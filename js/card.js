export default class card {
    constructor(x, y) {
        this.nodeCount = 1;
        this.effect = "None";
        this.nodeSelected = false;
        this.positionY = 0;
        this.positionX = 0;
        this.genre = "Cow-cowboys";
        this.type = "Creature";
        this.playable = true;
        this.state = 'deck';
        this.sprite = "img.png"
        this.zona = "zone";
    }

    card_type = {
        CREATURE: 'Creature',
        OBJECT: 'Object',
        SPELL: 'Spell',
    }
    card_status = {
        DECK: 'Deck',
        GRAVEYARD: 'Graveyard',
        HAND: 'Hand',
        FIELD: 'Field',
    }
    card_genre = {
        COW_COWBOYS: 'Cow-cowboys',
        WIZARDS: 'Wizards',
        KNIGHTS: 'Knights',
    }

}