import Hologram from './hologram.js';

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
        MULT: 'Mult',
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
        // this.state = Card.CARD_STATUS.DECK;
        this.desc = '';
        this.sprite = new Image();
        this.holo = new Hologram();
        this.initValue;
        this.value;
        this.bonusValue = 0;
        this.multValue = 1;
        this.minusValue = 0;
        this.effects = {};
        this.transparent = false;
    }

    AddParams(genre, type, value, spriteSrc, holoSrc, desc) {
        this.genre = genre;
        this.type = type;
        this.initValue = value
        this.value = this.initValue;
        this.sprite.src = spriteSrc;
        this.holo.sprite.src = holoSrc;
        this.desc = desc;
    }

    RemoveFromZone(zone) {
        zone.cards.splice(this.type, 1, null);
    }

    ReplaceCard(ent, zone, card, targetCardName) {
        ent.counts[card.name]--;
        let bonusVal = zone.cards[card.type].bonusValue;
        let minusVal = zone.cards[card.type].minusValue;
        let multVal = zone.cards[card.type].multValue;
        let oldEffects = zone.cards[card.type].effects;
        zone.cards.splice(card.type, 1, ent.CreateCard(targetCardName));
        zone.cards[card.type].effects = oldEffects
        zone.cards[card.type].bonusValue = bonusVal;
        zone.cards[card.type].minusValue = minusVal;
        zone.cards[card.type].multValue = multVal;
        ent.AddCardCount(zone.cards[card.type]);
    }

    DoCardMath(card) {
        //console.log("math for " + card.name + ":")
        //console.log(card.initValue +  " + " + card.bonusValue + " - " + card.minusValue + " * " + card.multValue)
        let finalValue = (card.initValue + card.bonusValue - card.minusValue) * card.multValue;
        return finalValue
    }

    TurnEffect(ent, zones, thisZone) {
        switch (this.name) {
            case "Mysterious Stranger":
                if (this.effects[Card.CARD_EFFECT.PERISH]) {
                    ent.counts[this.name]--;
                    for (let i = 0; i < zones.length; i++) {
                        if (zones[i].cards[Card.CARD_TYPE.CREATURE] && zones[i].cards[Card.CARD_TYPE.CREATURE].name == this.name) {
                            zones[i].cards[Card.CARD_TYPE.CREATURE].minusValue--;
                            zones[i].cards[Card.CARD_TYPE.CREATURE].value = this.DoCardMath(zones[i].cards[Card.CARD_TYPE.CREATURE]);
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
                        for (let i = 0; i < ent.deck.length; i++) {
                            if (ent.deck[i].name == "Bandit Leader") {
                                break;
                            } else {
                                this.ReplaceCard(ent, thisZone, this, "Bandit Leader");
                            }
                        }
                    }
                }
                break;
            case "Cow-Cowboy":
                if (this.effects[Card.CARD_EFFECT.PERISH]) {
                    ent.counts[this.name]--;
                    for (let i = 0; i < zones.length; i++) {
                        if (zones[i].cards[Card.CARD_TYPE.CREATURE] && zones[i].cards[Card.CARD_TYPE.CREATURE].name == this.name) {
                            zones[i].cards[Card.CARD_TYPE.CREATURE].bonusValue -= 2;
                            zones[i].cards[Card.CARD_TYPE.CREATURE].value = this.DoCardMath(zones[i].cards[Card.CARD_TYPE.CREATURE]);
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
                if (thisZone.cards[Card.CARD_TYPE.CREATURE]) {
                    thisZone.cards[Card.CARD_TYPE.CREATURE].bonusValue -= this.value;
                    thisZone.cards[Card.CARD_TYPE.CREATURE].value = this.DoCardMath(thisZone.cards[Card.CARD_TYPE.CREATURE]);
                    thisZone.cards[Card.CARD_TYPE.CREATURE].effects[Card.CARD_EFFECT.BOOSTED] = false;
                }
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
                    if (playedCard.name == "Mysterious Stranger" && zones[i].cards[Card.CARD_TYPE.CREATURE] && zones[i].cards[Card.CARD_TYPE.CREATURE].name == this.name) {
                        zones[i].cards[Card.CARD_TYPE.CREATURE].minusValue = ent.counts[this.name] - 1;
                        zones[i].cards[Card.CARD_TYPE.CREATURE].value = this.DoCardMath(zones[i].cards[Card.CARD_TYPE.CREATURE]);
                        if (zones[i].cards[Card.CARD_TYPE.CREATURE].value < 0) {
                            zones[i].cards[Card.CARD_TYPE.CREATURE].value = 0;
                        }
                    }
                }
                break;
            case "Big Iron":
                if (thisZone.cards[Card.CARD_TYPE.CREATURE] && thisZone.cards[Card.CARD_TYPE.CREATURE].genre == Card.CARD_GENRE.COW_COWBOYS && !thisZone.cards[Card.CARD_TYPE.CREATURE].effects[Card.CARD_EFFECT.PERISH]) {
                    thisZone.cards[Card.CARD_TYPE.CREATURE].bonusValue += this.value;
                    thisZone.cards[Card.CARD_TYPE.CREATURE].value = this.DoCardMath(thisZone.cards[Card.CARD_TYPE.CREATURE]);
                    //thisZone.cards[Card.CARD_TYPE.CREATURE].value *= thisZone.cards[Card.CARD_TYPE.CREATURE].multValue;
                    thisZone.cards[Card.CARD_TYPE.CREATURE].effects[Card.CARD_EFFECT.PERISH] = true;
                    console.log(this.name + " effect: " + thisZone.cards[Card.CARD_TYPE.CREATURE].name + " value now " + thisZone.cards[Card.CARD_TYPE.CREATURE].value);
                }
                break;
            case "Cheese Moon":
                for (let i = 0; i < zones.length; i++) {
                    if (!this.played && zones[i].cards[Card.CARD_TYPE.CREATURE] && zones[i].cards[Card.CARD_TYPE.CREATURE].genre == Card.CARD_GENRE.COW_COWBOYS) {
                        switch (zones[i].cards[Card.CARD_TYPE.CREATURE].name) {
                            case "Mysterious Stranger":
                                zones[i].cards[Card.CARD_TYPE.CREATURE].minusValue = 0;
                                this.ReplaceCard(ent, zones[i], zones[i].cards[Card.CARD_TYPE.CREATURE], "Cow-Cowboy")
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
                for (let i = 0; i < zones.length; i++) {
                    if (zones[i].cards[Card.CARD_TYPE.CREATURE] && zones[i].cards[Card.CARD_TYPE.CREATURE].name == "Cow-Cowboy") {
                        zones[i].cards[Card.CARD_TYPE.CREATURE].PlayEffect(ent, zones[i].cards[Card.CARD_TYPE.CREATURE], zones, zones[i]);
                    }
                }
                this.played = true;
                break;
            case "Cow-Cowboy":
                if (playedCard.name == "Cow-Cowboy" && thisZone.cards[Card.CARD_TYPE.CREATURE] && thisZone.cards[Card.CARD_TYPE.CREATURE].name == this.name) {
                    thisZone.cards[Card.CARD_TYPE.CREATURE].bonusValue += (ent.counts[this.name] - 1) * 2;
                    thisZone.cards[Card.CARD_TYPE.CREATURE].value = this.DoCardMath(thisZone.cards[Card.CARD_TYPE.CREATURE]);
                    //zones[i].cards[Card.CARD_TYPE.CREATURE].value = zones[i].cards[Card.CARD_TYPE.CREATURE].initValue + zones[i].cards[Card.CARD_TYPE.CREATURE].bonusValue + ((ent.counts[this.name] - 1) * 2);
                    //zones[i].cards[Card.CARD_TYPE.CREATURE].value *= zones[i].cards[Card.CARD_TYPE.CREATURE].multValue;
                }
                break;
            case "Milk":
                if (thisZone.cards[Card.CARD_TYPE.CREATURE] && thisZone.cards[Card.CARD_TYPE.CREATURE].genre == Card.CARD_GENRE.COW_COWBOYS && !thisZone.cards[Card.CARD_TYPE.CREATURE].effects[Card.CARD_EFFECT.BOOSTED]) {
                    thisZone.cards[Card.CARD_TYPE.CREATURE].bonusValue += this.value;
                    thisZone.cards[Card.CARD_TYPE.CREATURE].value = this.DoCardMath(thisZone.cards[Card.CARD_TYPE.CREATURE]);
                    //thisZone.cards[Card.CARD_TYPE.CREATURE].value = thisZone.cards[Card.CARD_TYPE.CREATURE].initValue + thisZone.cards[Card.CARD_TYPE.CREATURE].bonusValue;
                    //thisZone.cards[Card.CARD_TYPE.CREATURE].value *= thisZone.cards[Card.CARD_TYPE.CREATURE].multValue;
                    thisZone.cards[Card.CARD_TYPE.CREATURE].effects[Card.CARD_EFFECT.BOOSTED] = true;
                }
                break;
            case "Sheriff Badge":
                if (thisZone.cards[Card.CARD_TYPE.CREATURE] && thisZone.cards[Card.CARD_TYPE.CREATURE].genre == Card.CARD_GENRE.COW_COWBOYS && !thisZone.cards[Card.CARD_TYPE.CREATURE].effects[Card.CARD_EFFECT.MULT]) {
                    thisZone.cards[Card.CARD_TYPE.CREATURE].multValue *= this.value;
                    thisZone.cards[Card.CARD_TYPE.CREATURE].value = this.DoCardMath(thisZone.cards[Card.CARD_TYPE.CREATURE]);
                    //thisZone.cards[Card.CARD_TYPE.CREATURE].value *= thisZone.cards[Card.CARD_TYPE.CREATURE].multValue;
                    thisZone.cards[Card.CARD_TYPE.CREATURE].effects[Card.CARD_EFFECT.MULT] = true;
                }
                break;
            case "Cheese Amulet":
                if (!this.played && thisZone.cards[Card.CARD_TYPE.CREATURE] && thisZone.cards[Card.CARD_TYPE.CREATURE].genre == Card.CARD_GENRE.COW_COWBOYS) {
                    switch (thisZone.cards[Card.CARD_TYPE.CREATURE].name) {
                        case "Mysterious Stranger":
                            thisZone.cards[Card.CARD_TYPE.CREATURE].minusValue = 0;
                            this.ReplaceCard(ent, thisZone, thisZone.cards[Card.CARD_TYPE.CREATURE], "Cow-Cowboy")
                            break;
                        case "Bandit Leader":
                            this.ReplaceCard(ent, thisZone, thisZone.cards[Card.CARD_TYPE.CREATURE], "Herd Leader")
                            thisZone.cards[Card.CARD_TYPE.CREATURE].PlayEffect(ent, thisZone.cards[Card.CARD_TYPE.CREATURE], zones, thisZone);
                            break;
                        case "Goon":
                            this.ReplaceCard(ent, thisZone, thisZone.cards[Card.CARD_TYPE.CREATURE], "Cow Goon")
                            thisZone.cards[Card.CARD_TYPE.CREATURE].PlayEffect(ent, thisZone.cards[Card.CARD_TYPE.CREATURE], zones, thisZone);
                            break;
                        default:
                            console.log("invalid cowboy creature");
                    }
                }
                break;
            default:
                this.value = this.DoCardMath(this);
            // console.log("no effect");
        }
    }

}