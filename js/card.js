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
        // this.played = false;
        this.state = Card.CARD_STATUS.DECK;
        this.sprite = new Image();
        this.holo = new Image();
        this.zone;
        this.initValue;
        this.value;
        this.bonusValue = 0;
    }

    AddParams(genre, type, value, spriteSrc, holoSrc) {
        this.genre = genre;
        this.type = type;
        this.initValue = value
        this.value = this.initValue;
        this.sprite.src = spriteSrc;
        this.holo.src = holoSrc;
    }

    RemoveFromZone(zone) {
        zone.cards.splice(this.type, 1, null);
    }

    TurnEffect(ent, zones, thisZone) {
        switch (this.name) {
            case "Mysterious Stranger":
                if (this.perish) {
                    ent.counts["Mysterious Stranger"]--;
                    for (let i = 0; i < zones.length; i++) {
                        if (zones[i].cards[Card.CARD_TYPE.CREATURE] && zones[i].cards[Card.CARD_TYPE.CREATURE].name == "Mysterious Stranger") {
                            zones[i].cards[Card.CARD_TYPE.CREATURE].value++;
                        }
                    }
                    this.RemoveFromZone(thisZone);
                }
                break;
            case "Bandit Leader":
                if (this.perish) {
                    this.RemoveFromZone(thisZone);
                }
                break;
            default:
            // console.log("no effect");
        }
    }

    PlayEffect(ent, playedCard, zones, thisZone) {
        switch (this.name) {
            case "Mysterious Stranger":
                for (let i = 0; i < zones.length; i++) {
                    if (playedCard.name == "Mysterious Stranger" && zones[i].cards[Card.CARD_TYPE.CREATURE] && zones[i].cards[Card.CARD_TYPE.CREATURE].name == "Mysterious Stranger") {
                        if (zones[i].cards[Card.CARD_TYPE.CREATURE].value >= 0) {
                            zones[i].cards[Card.CARD_TYPE.CREATURE].value = zones[i].cards[Card.CARD_TYPE.CREATURE].initValue + zones[i].cards[Card.CARD_TYPE.CREATURE].bonusValue - (ent.counts["Mysterious Stranger"] - 1);
                        }
                    }
                }
                break;
            case "Big Iron":
                if (thisZone.cards[Card.CARD_TYPE.CREATURE] && thisZone.cards[Card.CARD_TYPE.CREATURE].genre == Card.CARD_GENRE.COW_COWBOYS && !thisZone.cards[Card.CARD_TYPE.CREATURE].perish) {
                    thisZone.cards[Card.CARD_TYPE.CREATURE].bonusValue += this.value;
                    thisZone.cards[Card.CARD_TYPE.CREATURE].value += thisZone.cards[Card.CARD_TYPE.CREATURE].bonusValue;
                    thisZone.cards[Card.CARD_TYPE.CREATURE].perish = true;
                    this.perish = true;
                    console.log(this.name + " effect: " + thisZone.cards[Card.CARD_TYPE.CREATURE].name + " value now " + thisZone.cards[Card.CARD_TYPE.CREATURE].value);
                }
                break;
            default:
            // console.log("no effect");
        }
    }

}