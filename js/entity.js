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
          this.deck[i].AddParams(
            Card.CARD_GENRE.COW_COWBOYS, // genre
            Card.CARD_TYPE.CREATURE, // type
            3, // value
            'assets/card-template-c.png', // sprite
            null // hologram sprite
          )
          break;

        case "Bandit Leader":
          this.deck[i].AddParams(
            Card.CARD_GENRE.COW_COWBOYS,
            Card.CARD_TYPE.CREATURE,
            2,
            'assets/card-template-c.png',
            null
          )
          break;

        case "Big Iron":
          this.deck[i].AddParams(
            Card.CARD_GENRE.COW_COWBOYS,
            Card.CARD_TYPE.OBJECT,
            3,
            'assets/card-template-o.png',
            null
          )
          break;

        case "Cheese Moon":
          this.deck[i].AddParams(
            Card.CARD_GENRE.COW_COWBOYS,
            Card.CARD_TYPE.SPELL,
            0,
            'assets/card-template-s.png',
            null
          )
          break;

        default:
          console.log(cardArray[i] + "no existe");

      }
    }
  }

  PlayCard(battle, zone, card) {
    if (this.cardsPlayed < 3) {
      let isPlacementValid = battle.rvlZones[zone].InsertCard(card);
      if (isPlacementValid) {
        this.hand.splice(this.hand.indexOf(card), 1);
        this.cardsPlayed++;
        console.log("played " + card.name);
        return true;
      } else {
        console.log("couldnt play " + card.name + " in zone " + (zone + 1));
        return false;
      }
    }
  }
}