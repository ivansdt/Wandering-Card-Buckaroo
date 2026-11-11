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
            'assets/cards/cow-cowboys/MS-Card.png', // sprite
            "assets/holograms/The-Mysterious-Stranger.png" // hologram sprite
          )
          break;

        case "Bandit Leader":
          this.deck[i].AddParams(
            Card.CARD_GENRE.COW_COWBOYS,
            Card.CARD_TYPE.CREATURE,
            2,
            'assets/cards/cow-cowboys/Bandit-Leader-Card.png',
            "assets/holograms/Bandit-Leader.png"
          )
          break;

        case "Big Iron":
          this.deck[i].AddParams(
            Card.CARD_GENRE.COW_COWBOYS,
            Card.CARD_TYPE.OBJECT,
            3,
            'assets/cards/cow-cowboys/Big-Iron-Card.png',
            'assets/holograms/Big-Iron.png'
          )
          break;

        case "Cheese Moon":
          this.deck[i].AddParams(
            Card.CARD_GENRE.COW_COWBOYS,
            Card.CARD_TYPE.SPELL,
            0,
            'assets/cards/cow-cowboys/Cheese-Full-Moon-Card.png',
            'assets/holograms/Cheese-Full-Moon.png'
          )
          break;

        case "Goon":
          this.deck[i].AddParams(
            Card.CARD_GENRE.COW_COWBOYS,
            Card.CARD_TYPE.CREATURE,
            0,
            'assets/cards/cow-cowboys/Goon-Card.png',
            'assets/holograms/Cow-Goons.png'
          )
          break;

        case "Cheese Amulet":
          this.deck[i].AddParams(
            Card.CARD_GENRE.COW_COWBOYS,
            Card.CARD_TYPE.OBJECT,
            0,
            'assets/cards/cow-cowboys/Cheese-Amulet-Card.png',
            'assets/holograms/Cheese-Amulet.png'
          )
          break;

        case "Sheriff Badge":
          this.deck[i].AddParams(
            Card.CARD_GENRE.COW_COWBOYS,
            Card.CARD_TYPE.OBJECT,
            0,
            'assets/cards/cow-cowboys/Sherrif-badge-card.png',
            'assets/holograms/Sheriff-Badge.png'
          )
          break;

        case "Cow Goon":
          this.deck[i].AddParams(
            Card.CARD_GENRE.COW_COWBOYS,
            Card.CARD_TYPE.CREATURE,
            0,
            'assets/cards/cow-cowboys/Cow-Goon-Card.png',
            'assets/holograms/Cow-Goons.png'
          )
          break;

        case "Herd Leader":
          this.deck[i].AddParams(
            Card.CARD_GENRE.COW_COWBOYS,
            Card.CARD_TYPE.CREATURE,
            0,
            'assets/cards/cow-cowboys/Cow-Bandit-Leader-Card.png',
            'assets/holograms/Cow-Leader.png'
          )
          break;

        case "Cow.Cowboy":
          this.deck[i].AddParams(
            Card.CARD_GENRE.COW_COWBOYS,
            Card.CARD_TYPE.CREATURE,
            0,
            'assets/cards/cow-cowboys/Cow-MS-Card.png',
            'assets/holograms/Cow-Stranger.png'
          )
          break;

         case "Milk":
          this.deck[i].AddParams(
            Card.CARD_GENRE.COW_COWBOYS,
            Card.CARD_TYPE.SPELL,
            0,
            'assets/cards/cow-cowboys/Cheese-Full-Moon-Card.png',
            'assets/holograms/Cheese-Full-Moon.png'
          )
          break;

        default:
          console.log(cardArray[i] + "no existe");

      }
    }
  }

  PlayCard(zones, zoneIndex, card) {
    if (this.cardsPlayed < 3) {
      let isPlacementValid = zones[zoneIndex].InsertCard(card);
      if (isPlacementValid) {
        this.hand.splice(this.hand.indexOf(card), 1);
        this.deck.splice(this.deck.indexOf(card), 1);
        for (let i = 0; i < zones[zoneIndex].cards.length; i++) {
          if (zones[zoneIndex].cards[i]) {
            console.log("trying effect on zone " + zoneIndex);
            zones[zoneIndex].cards[i].PlayEffect(zones[zoneIndex]);
          }
        }
        // card.Effect(zones[zoneIndex]);
        card.isSelected = false;
        this.cardsPlayed++;
        console.log("played " + card.name);
        return true;
      } else {
        console.log("couldnt play " + card.name + " in zone " + (zoneIndex + 1));
        return false;
      }
    } else {
      console.log("already played 3 cards");
    }
  }
}