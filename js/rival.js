import Entity from "./entity.js";

export default class Rival extends Entity {
    PlayRandomCard(battle) {
        let randomIndex = Math.floor(Math.random() * availableCards.length);
        let chosenCard = this.hand.splice(randomIndex, 1)[0];
        battle.rvlZones[Math.random() * rvlZones.length].InsertCard(chosenCard);
        this.cardsPlayed++;
        battle.EndTurn(this);
    }
}