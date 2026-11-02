import Entity from "./entity.js";

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
                    isPlayed = this.PlayCard(battle, i, chosenCard)
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