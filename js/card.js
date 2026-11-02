export default class Card {

    static CARD_TYPE = {
        // los numeros seran las ids para insertarse en el array de la clase de zona con .splice
        CREATURE: 0,
        OBJECT: 1,
        SPELL: 2,
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
        // this.nodeCount = 1;
        // this.effect;    Creo que podemos referenciar el nombre de la carta para cada una tener un efecto especifico, es dificil encapsular todos los efectos
        this.isSelected = false;
        this.width = 150;
        this.height = 200;
        this.genre;
        this.type;
        this.playable = true;
        this.state = Card.CARD_STATUS.DECK;
        this.sprite;
        this.hologram; // Igual es un sprite pero seria el que se muestra en la zona como tal
        this.zone;
        this.value;
    }

    AddParams(genre, type, value, sprite, holo) {
        this.genre = genre;
        this.type = type;
        this.value = value;
        this.sprite = sprite;
        this.hologram = holo;
    }

    Effect(card) {

    }


 
}