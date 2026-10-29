import Card from './card.js';

export default class Entity {
  constructor(name) {
    this.name = name;
    this.deck = new Array(2); // 20 por default, se cambia para testeo
    this.sprite;
  }

  CreateDeck(cardArray) {
    for (let i = 0; i < this.deck.length; i++) {
      this.deck[i] = new Card();

      switch (cardArray[i]) {
        case "Mysterious Stranger":
          this.deck[i].genre = this.deck[i].CARD_TYPE.COW_COWBOYS;
          this.deck[i].type = this.deck[i].CARD_TYPE.CREATURE;
          this.deck[i].sprite = 'assets/card-template-c.png';
          break;
        case "Bandit Leader":
          this.deck[i].genre = this.deck[i].CARD_TYPE.COW_COWBOYS;
          this.deck[i].type = this.deck[i].CARD_TYPE.CREATURE;
          this.deck[i].sprite = 'assets/card-template-c.png';
          break;
        default:
          console.log("Esta carta no existe");
      }
      
    }
  }
}