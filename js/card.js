export default class Card {

    static CARD_TYPE = {
        CREATURE: 'Creature',
        OBJECT: 'Object',
        SPELL: 'Spell',
    }

    static CARD_STATUS = {
        DECK: 'Deck',
        GRAVEYARD: 'Graveyard',
        HAND: 'Hand',
        FIELD: 'Field',
    }

    static CARD_GENRE = {
        COW_COWBOYS: 'Cow-cowboys',
        WIZARDS: 'Wizards',
        KNIGHTS: 'Knights',
    }

    constructor() {
        this.name;
        this.x;
        this.y;
        this.nodeCount = 1;
        // this.effect;    Creo que podemos referenciar el nombre de la carta para cada una tener un efecto especifico, es dificil encapsular todos los efectos
        this.isSelected = false;
        this.width = 150;
        this.height = 200;
        this.genre;
        this.type;
        this.playable = true;
        this.state = Card.CARD_STATUS.DECK;
        this.sprite;
        this.zone;
        this.value;
    }

    Effect(card) {

    }


 
}