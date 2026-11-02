import Card from './card.js';

export default class Entity {
  constructor(name) {
    this.name = name;
    this.life = 10;
    this.deck = new Array();
    this.hand = new Array();
    this.sprite;
    this.cardsPlayed = 0;
  }

  CreateDeck(cardArray) {
    for (let i = 0; i < cardArray.length; i++) {
      this.deck[i] = new Card();
      this.deck[i].name = cardArray[i];

      switch (cardArray[i]) {
        case "Mysterious Stranger":
          this.deck[i].genre = Card.CARD_GENRE.COW_COWBOYS;
          this.deck[i].type = Card.CARD_TYPE.CREATURE;
          this.deck[i].sprite = 'assets/card-template-c.png';
          this.deck[i].value = 3;
          break;
        case "Bandit Leader":
          this.deck[i].genre = Card.CARD_GENRE.COW_COWBOYS;
          this.deck[i].type = Card.CARD_TYPE.CREATURE;
          this.deck[i].sprite = 'assets/card-template-c.png';
          this.deck[i].value = 2;
          break;
        case "Big Iron":
          this.deck[i].genre = Card.CARD_GENRE.COW_COWBOYS;
          this.deck[i].type = Card.CARD_TYPE.OBJECT;
          this.deck[i].sprite = 'assets/card-template-o.png';
          this.deck[i].value = 3;
          break;
        default:
          console.log(cardArray[i] + "no existe");
      }
    }
  }

  PlayCard(battle, zone, card) {
    if (this.cardsPlayed > 3) {
      let isPlacementValid = battle.rvlZones[zone].InsertCard(card);
      if (isPlacementValid) {
        this.hand.splice(this.hand.indexOf(card), 1);
        this.cardsPlayed++;
        console.log("played");
        return true;
      } else {
        return false;
      }
    }
  }
}