import Entity from "./entity.js";
import Card from "./card.js";

export default class Rival extends Entity {
    PlayRandomCard(battle) {
        // console.log(battle);
        for (let i = 0; i < battle.rvlZones.length; i++) {
            let availableCards = new Array();
            for (let k = 0; k < this.hand.length; k++) {
                availableCards.push(this.hand[k]);
            }
            let isPlayed = false;
            while (!isPlayed) {
                if (availableCards.length > 0) {
                    let randomIndex = Math.floor(Math.random() * availableCards.length);
                    let chosenCard = availableCards[randomIndex];
                    console.log("attempting to play " + chosenCard.name + " on zone " + (i + 1));
                    availableCards.splice(randomIndex, 1)
                    isPlayed = this.PlayCard(battle.rvlZones, i, chosenCard)
                } else {
                    console.log("moving to next zone " + (i + 2));
                    break;
                }
            }

            if (isPlayed) {
                return true;
            }
        }
        return false;
    }

    PlayBanditLeaderStrat(battle) {
        for (let i = 0; i < battle.rvlZones.length; i++) {
            let availableCards = new Array();
            for (let j = 0; j < this.hand.length; j++) {
                availableCards.push(this.hand[j]);
            }
            let isPlayed = false;
            while (!isPlayed) {
                if (availableCards.length > 0) {
                    let chosenCard;
                    if (!this.counts["Herd Leader"] || this.counts["Herd Leader"] < 2) {
                        if (!battle.rvlZones[i].cards[Card.CARD_TYPE.CREATURE]) {
                            for (let k = 0; k < availableCards.length; k++) {
                                if (availableCards[k].name == "Bandit Leader") {
                                    chosenCard = availableCards[k];
                                    break;
                                }
                            }
                        }
                        else if (!battle.rvlZones[i].cards[Card.CARD_TYPE.OBJECT]) {
                            for (let k = 0; k < availableCards.length; k++) {
                                if (availableCards[k].name == "Cheese Amulet") {
                                    chosenCard = availableCards[k];
                                    break;
                                }
                            }
                            if (!chosenCard) {
                                for (let k = 0; k < availableCards.length; k++) {
                                    if (availableCards[k].name == "Sheriff Badge") {
                                        chosenCard = availableCards[k];
                                        break;
                                    }
                                }
                            }
                        }
                        else if (!battle.rvlZones[i].cards[Card.CARD_TYPE.SPELL]) {
                            for (let k = 0; k < availableCards.length; k++) {
                                if (availableCards[k].name == "Milk") {
                                    chosenCard = availableCards[k];
                                    break;
                                }
                            }
                        }
                    } else {
                        if (!battle.rvlZones[i].cards[Card.CARD_TYPE.CREATURE]) {
                            if ((!this.counts["Bandit Leader"] || this.counts["Bandit Leader"] < 1) && (!battle.rvlZones[i].cards[Card.CARD_TYPE.OBJECT] || battle.rvlZones[i].cards[Card.CARD_TYPE.OBJECT].name != "Cheese Amulet")) {
                                for (let k = 0; k < availableCards.length; k++) {
                                    if (availableCards[k].name == "Bandit Leader") {
                                        chosenCard = availableCards[k];
                                        break;
                                    }
                                }
                            } else if (!battle.rvlZones[i].cards[Card.CARD_TYPE.OBJECT] || battle.rvlZones[i].cards[Card.CARD_TYPE.OBJECT].name != "Cheese Amulet") {
                                for (let k = 0; k < availableCards.length; k++) {
                                    if (availableCards[k].name == "Cow Goon") {
                                        chosenCard = availableCards[k];
                                        break;
                                    }
                                }
                            }
                        }
                        else if (!battle.rvlZones[i].cards[Card.CARD_TYPE.OBJECT]) {
                            if (battle.rvlZones[i].cards[Card.CARD_TYPE.CREATURE] && battle.rvlZones[i].cards[Card.CARD_TYPE.CREATURE].name == "Bandit Leader") {
                                for (let k = 0; k < availableCards.length; k++) {
                                    if (availableCards[k].name == "Sheriff Badge") {
                                        chosenCard = availableCards[k];
                                        break;
                                    }
                                }
                            }
                        }
                        else if (!battle.rvlZones[i].cards[Card.CARD_TYPE.SPELL]) {
                            if (battle.rvlZones[i].cards[Card.CARD_TYPE.CREATURE].name == "Bandit Leader") {
                                for (let k = 0; k < availableCards.length; k++) {
                                    if (availableCards[k].name == "Milk") {
                                        chosenCard = availableCards[k];
                                        break;
                                    }
                                }
                            }
                            else if (this.counts["Milk"] > 0) {
                                for (let k = 0; k < availableCards.length; k++) {
                                    if (availableCards[k].name == "Milk") {
                                        chosenCard = availableCards[k];
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    if (!chosenCard) {
                        availableCards = new Array();
                    } else {
                        console.log("attempting to play " + chosenCard.name + " on zone " + (i + 1));
                        availableCards.splice(availableCards.indexOf(chosenCard), 1)
                        isPlayed = this.PlayCard(battle.rvlZones, i, chosenCard)
                    }
                } else {
                    console.log("moving to next zone " + (i + 2));
                    break;
                }
            }

            if (isPlayed) {
                return true;
            }
        }
        return false;
    }
}