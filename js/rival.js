import Entity from "./entity.js";

export default class Rival extends Entity {
    PlayRandomCard(battle) {
        console.log(battle);
        for (let i = 0; i < battle.rvlZones.length; i++) {
            let availableCards = new Array();
            for (let i = 0; i < this.hand.length; i++) {
                availableCards.push(this.hand[i]);
            }
            let isPlayed = false;
            while (!isPlayed) {
                if (availableCards.length > 0) {
                    let randomIndex = Math.floor(Math.random() * availableCards.length);
                    let chosenCard = availableCards[randomIndex];
                    console.log(chosenCard);
                    console.log(availableCards);
                    availableCards.splice(randomIndex, 1)
                    isPlayed = this.PlayCard(battle, i, chosenCard)
                    console.log(isPlayed);
                } else {
                    console.log("didnt play");
                    return false;
                }
            }
            console.log("played");
            return true;
        }
    }
}