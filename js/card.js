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

    static CARD_EFFECT = {
        PERISH: 'Perish',
        BOOSTED: 'Boosted',
    }

    constructor() {
        this.name;
        this.x;
        this.y;
        // this.nodeCount = 1;
        this.isSelected = false;
        this.width = 150;
        this.height = 200;
        this.genre;
        this.type;
        this.played = false;
        this.state = Card.CARD_STATUS.DECK;
        this.sprite = new Image();
        this.holo = new Image();
        this.zone;
        this.initValue;
        this.value;
        this.bonusValue = 0;
        this.effects = {
            "Perish": false,
            "Boosted": false,
        }
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

    ReplaceCard(ent, zone, card, targetCardName) {
        ent.counts[card.name]--;
        let bonusVal = zone.cards[card.type].bonusValue;
        if (zone.cards[card.type].effects[Card.CARD_EFFECT.PERISH]) {
            zone.cards.splice(card.type, 1, ent.CreateCard(targetCardName));
            zone.cards[card.type].effects[Card.CARD_EFFECT.PERISH] = true;
            zone.cards[card.type].bonusValue = bonusVal;
        } else {
            zone.cards.splice(card.type, 1, ent.CreateCard(targetCardName));
            zone.cards[card.type].bonusValue = bonusVal;
        }
        ent.AddCardCount(zone.cards[card.type]);
    }

    TurnEffect(ent, zones, thisZone) {
        switch (this.name) {
            case "Mysterious Stranger":
                if (this.effects[Card.CARD_EFFECT.PERISH]) {
                    ent.counts[this.name]--;
                    for (let i = 0; i < zones.length; i++) {
                        if (zones[i].cards[Card.CARD_TYPE.CREATURE] && zones[i].cards[Card.CARD_TYPE.CREATURE].name == this.name) {
                            zones[i].cards[Card.CARD_TYPE.CREATURE].value++;
                        }
                    }
                    this.RemoveFromZone(thisZone);
                }
                break;
            case "Bandit Leader":
                if (this.effects[Card.CARD_EFFECT.PERISH]) {
                    ent.counts[this.name]--;
                    this.RemoveFromZone(thisZone);
                } else {
                    ent.hand.splice(ent.hand.length, 0, ent.CreateCard("Goon"))
                }
                break;
            case "Goon":
                if (this.effects[Card.CARD_EFFECT.PERISH]) {
                    ent.counts[this.name]--;
                    this.RemoveFromZone(thisZone);
                } else {
                    if (!ent.counts["Bandit Leader"] || ent.counts["Bandit Leader"] == 0) {
                        this.ReplaceCard(ent, thisZone, this, "Bandit Leader");
                    }
                }
                break;
            case "Cow-Cowboy":
                if (this.effects[Card.CARD_EFFECT.PERISH]) {
                    ent.counts[this.name]--;
                    for (let i = 0; i < zones.length; i++) {
                        if (zones[i].cards[Card.CARD_TYPE.CREATURE] && zones[i].cards[Card.CARD_TYPE.CREATURE].name == this.name) {
                            zones[i].cards[Card.CARD_TYPE.CREATURE].value -= 2;
                        }
                    }
                    this.RemoveFromZone(thisZone);
                }
                break;
            case "Herd Leader":
                if (this.effects[Card.CARD_EFFECT.PERISH]) {
                    ent.counts[this.name]--;
                    this.RemoveFromZone(thisZone);
                } else {
                    ent.hand.splice(ent.hand.length, 0, ent.CreateCard("Cow Goon"))
                }
                break;
            case "Cow Goon":
                if (this.effects[Card.CARD_EFFECT.PERISH]) {
                    ent.counts[this.name]--;
                    this.RemoveFromZone(thisZone);
                } else {
                    ent.hand.splice(ent.hand.length, 0, ent.CreateCard("Milk"))
                }
                break;
            case "Milk":
                ent.counts[this.name]--;
                this.RemoveFromZone(thisZone);
                break;
            default:
            // console.log("no effect");
        }
    }

    PlayEffect(ent, playedCard, zones, thisZone) {
        switch (this.name) {
            case "Mysterious Stranger":
                for (let i = 0; i < zones.length; i++) {
                    if (playedCard.name == this.name && zones[i].cards[Card.CARD_TYPE.CREATURE] && zones[i].cards[Card.CARD_TYPE.CREATURE].name == this.name) {
                        zones[i].cards[Card.CARD_TYPE.CREATURE].value = zones[i].cards[Card.CARD_TYPE.CREATURE].initValue + zones[i].cards[Card.CARD_TYPE.CREATURE].bonusValue - (ent.counts[this.name] - 1);
                        if (zones[i].cards[Card.CARD_TYPE.CREATURE].value < 0) {
                            zones[i].cards[Card.CARD_TYPE.CREATURE].value = 0;
                        }
                    }
                }
                break;
            case "Big Iron":
                if (thisZone.cards[Card.CARD_TYPE.CREATURE] && thisZone.cards[Card.CARD_TYPE.CREATURE].genre == Card.CARD_GENRE.COW_COWBOYS && !thisZone.cards[Card.CARD_TYPE.CREATURE].effects[Card.CARD_EFFECT.PERISH]) {
                    thisZone.cards[Card.CARD_TYPE.CREATURE].bonusValue += this.value;
                    thisZone.cards[Card.CARD_TYPE.CREATURE].value += thisZone.cards[Card.CARD_TYPE.CREATURE].bonusValue;
                    thisZone.cards[Card.CARD_TYPE.CREATURE].effects[Card.CARD_EFFECT.PERISH] = true;
                    console.log(this.name + " effect: " + thisZone.cards[Card.CARD_TYPE.CREATURE].name + " value now " + thisZone.cards[Card.CARD_TYPE.CREATURE].value);
                }
                break;
            case "Cheese Moon":
                for (let i = 0; i < zones.length; i++) {
                    if (!this.played && zones[i].cards[Card.CARD_TYPE.CREATURE] && zones[i].cards[Card.CARD_TYPE.CREATURE].genre == Card.CARD_GENRE.COW_COWBOYS) {
                        switch (zones[i].cards[Card.CARD_TYPE.CREATURE].name) {
                            case "Mysterious Stranger":
                                this.ReplaceCard(ent, zones[i], zones[i].cards[Card.CARD_TYPE.CREATURE], "Cow-Cowboy")
                                zones[i].cards[Card.CARD_TYPE.CREATURE].PlayEffect(ent, zones[i].cards[Card.CARD_TYPE.CREATURE], zones, zones[i]);
                                break;
                            case "Bandit Leader":
                                this.ReplaceCard(ent, zones[i], zones[i].cards[Card.CARD_TYPE.CREATURE], "Herd Leader")
                                zones[i].cards[Card.CARD_TYPE.CREATURE].PlayEffect(ent, zones[i].cards[Card.CARD_TYPE.CREATURE], zones, zones[i]);
                                break;
                            case "Goon":
                                this.ReplaceCard(ent, zones[i], zones[i].cards[Card.CARD_TYPE.CREATURE], "Cow Goon")
                                zones[i].cards[Card.CARD_TYPE.CREATURE].PlayEffect(ent, zones[i].cards[Card.CARD_TYPE.CREATURE], zones, zones[i]);
                                break;
                            default:
                                console.log("invalid cowboy creature");
                        }
                    }
                }
                this.played = true;
                break;
            case "Cow-Cowboy":
                for (let i = 0; i < zones.length; i++) {
                    if (playedCard.name == this.name && zones[i].cards[Card.CARD_TYPE.CREATURE] && zones[i].cards[Card.CARD_TYPE.CREATURE].name == this.name) {
                        zones[i].cards[Card.CARD_TYPE.CREATURE].value = zones[i].cards[Card.CARD_TYPE.CREATURE].initValue + zones[i].cards[Card.CARD_TYPE.CREATURE].bonusValue + ((ent.counts[this.name] - 1) * 2);
                    }
                }
                break;
            case "Milk":
                if (thisZone.cards[Card.CARD_TYPE.CREATURE] && thisZone.cards[Card.CARD_TYPE.CREATURE].genre == Card.CARD_GENRE.COW_COWBOYS && !thisZone.cards[Card.CARD_TYPE.CREATURE].effects[Card.CARD_EFFECT.BOOSTED]) {
                    thisZone.cards[Card.CARD_TYPE.CREATURE].bonusValue += this.value;
                    thisZone.cards[Card.CARD_TYPE.CREATURE].value += thisZone.cards[Card.CARD_TYPE.CREATURE].bonusValue;
                    thisZone.cards[Card.CARD_TYPE.CREATURE].effects[Card.CARD_EFFECT.BOOSTED];
                }
                break;
            case "Herd Leader":
                // no tiene efecto de jugada
                break;
            default:
            // console.log("no effect");
        }
    }

}