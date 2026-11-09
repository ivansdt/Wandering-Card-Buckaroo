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
        this.effect = false;
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

    RemoveFromZone(zone) {
        zone.cards.splice(this.type, 1, null);
    }

    TurnEffect(zone) {
        switch (this.name) {
            case "Mysterious Stranger":
                if (this.perish) {
                    this.RemoveFromZone(zone);
                }
                break;
            case "Bandit Leader":
                if (this.perish) {
                    this.RemoveFromZone(zone);
                }
                break;
            default:
            // console.log("no effect");
        }
    }

    PlayEffect(zone) {
        switch (this.name) {
            case "Big Iron":
                if (zone.cards[Card.CARD_TYPE.CREATURE] && zone.cards[Card.CARD_TYPE.CREATURE].genre == Card.CARD_GENRE.COW_COWBOYS && !zone.cards[Card.CARD_TYPE.CREATURE].perish) {
                    zone.cards[Card.CARD_TYPE.CREATURE].value += this.value;
                    zone.cards[Card.CARD_TYPE.CREATURE].perish = true;
                    this.perish = true;
                    console.log(this.name + " effect: " + zone.cards[Card.CARD_TYPE.CREATURE].name + " value now " + zone.cards[Card.CARD_TYPE.CREATURE].value);
                }
                break;
            default:
            // console.log("no effect");
        }
    }

}