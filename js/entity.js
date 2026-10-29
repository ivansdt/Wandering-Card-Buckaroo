import Card from './card.js';

export default class Entity {
  constructor(name) {
    this.name = name;
    this.deck = new Array(3); // 20 por default, se cambia para testeo
    this.sprite;
  }

  CreateDeck(cardArray) {
    for (let i = 0; i < this.deck.length; i++) {
      this.deck[i] = new Card();
      this.deck[i].name = cardArray[i];

      switch (cardArray[i]) {
        case "Mysterious Stranger":
          this.deck[i].genre = this.deck[i].CARD_GENRE.COW_COWBOYS;
          this.deck[i].type = this.deck[i].CARD_TYPE.CREATURE;
          this.deck[i].sprite = 'assets/card-template-c.png';
          this.deck[i].value = 3;
          break;
        case "Bandit Leader":
          this.deck[i].genre = this.deck[i].CARD_GENRE.COW_COWBOYS;
          this.deck[i].type = this.deck[i].CARD_TYPE.CREATURE;
          this.deck[i].sprite = 'assets/card-template-c.png';
          this.deck[i].value = 2;
          break;
        case "Big Iron":
          this.deck[i].genre = this.deck[i].CARD_GENRE.COW_COWBOYS;
          this.deck[i].type = this.deck[i].CARD_TYPE.OBJECT;
          this.deck[i].sprite = 'assets/card-template-o.png';
          this.deck[i].value = 3;
          break;
        default:
          console.log("Esta carta no existe");
      }

      console.log(this.deck[i]);

    }
  }
}