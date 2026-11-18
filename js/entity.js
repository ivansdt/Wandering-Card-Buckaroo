import Card from './card.js';

export default class Entity {
  constructor(name) {
    this.name = name;
    this.life = 10;
    this.deck = new Array();
    this.hand = new Array();
    this.sprite;
    this.cardsPlayed = 0;
    this.counts = {};
  }

  CreateCard(cardName) {
    let newCard = new Card();
    newCard.name = cardName;
    switch (cardName) {
      case "Mysterious Stranger":
        newCard.AddParams(
          Card.CARD_GENRE.COW_COWBOYS, // genre
          Card.CARD_TYPE.CREATURE, // type
          3, // value
          'assets/cards/cow-cowboys/MS-Card.png', // sprite
          'assets/holograms/cow-cowboys/MS-Side.png', // hologram sprite
          'Pierde 1 de valor por criatura\n"cowboy" en tu campo. \n\nForma vaca: Pierde 2 de ataque.\nGana 2 de ataque por criatura\n"Vaca" en tu campo.\n\nFlavor' // desc
        )
        break;

      case "Bandit Leader":
        newCard.AddParams(
          Card.CARD_GENRE.COW_COWBOYS,
          Card.CARD_TYPE.CREATURE,
          2,
          'assets/cards/cow-cowboys/Bandit-Leader-Card.png',
          'assets/holograms/cow-cowboys/Bandit-Leader-Side.png',
          'Al inicio del turno pon un Goon en\ntu mano.\n\nForma vaca: Al inicio del turno,  pon\nun Cow Goon en tu mano.\n\nFlavor'
        )
        break;

      case "Big Iron":
        newCard.AddParams(
          Card.CARD_GENRE.COW_COWBOYS,
          Card.CARD_TYPE.OBJECT,
          3,
          'assets/cards/cow-cowboys/Big-Iron-Card.png',
          'assets/holograms/cow-cowboys/Big-Iron.png',
          'Otorga 3 de valor a la criatura\nen esta zona, pero esta se destruye\nal inicio del turno.\n\nFlavor'
        )
        break;

      case "Cheese Moon":
        newCard.AddParams(
          Card.CARD_GENRE.COW_COWBOYS,
          Card.CARD_TYPE.SPELL,
          0,
          'assets/cards/cow-cowboys/Cheese-Full-Moon-Card.png',
          'assets/holograms/cow-cowboys/Cheese-Full-Moon.png',
          'Convierte todas las criaturas\n"cowboy" en tu campo en su forma\n"vaca".\n\nFlavor'
        )
        break;

      case "Goon":
        newCard.AddParams(
          Card.CARD_GENRE.COW_COWBOYS,
          Card.CARD_TYPE.CREATURE,
          1,
          'assets/cards/cow-cowboys/Goon-Card.png',
          'assets/holograms/cow-cowboys/Goons-Side.png',
          'Si no hay criaturas de "Bandit\nLeader" en tu deck convierte esta\ncriatura en "Bandit Leader"\n\nForma vaca: Pierde 1 de ataque.\nAl inicio del turno otorga un hechizo\nde "Milk" a tu mano\n\nFlavor'
        )
        break;

      case "Cheese Amulet":
        newCard.AddParams(
          Card.CARD_GENRE.COW_COWBOYS,
          Card.CARD_TYPE.OBJECT,
          0,
          'assets/cards/cow-cowboys/Cheese-Amulet-Card.png',
          'assets/holograms/cow-cowboys/Cheese-Amulet.png',
          'Convierte las criaturas "cowboy" \nen esta zona en su forma "vaca".\n\nFlavor'
        )
        break;

      case "Sheriff Badge":
        newCard.AddParams(
          Card.CARD_GENRE.COW_COWBOYS,
          Card.CARD_TYPE.OBJECT,
          2,
          'assets/cards/cow-cowboys/Sherrif-badge-card.png',
          'assets/holograms/cow-cowboys/Sheriff-Badge.png',
          'Duplica el ataque de la criaturas en\nesta zona\n\nFlavor'
        )
        break;

      case "Cow Goon":
        newCard.AddParams(
          Card.CARD_GENRE.COW_COWBOYS,
          Card.CARD_TYPE.CREATURE,
          0,
          'assets/cards/cow-cowboys/Cow-Goon-Card.png',
          'assets/holograms/cow-cowboys/Cow-Goons.png',
          'Forma vaca: pierde 1 de ataque.\n\nAl inicio del turno otorga una carta\nde "Milk"a tu mano.\n\nFlavor'
        )
        break;

      case "Herd Leader":
        newCard.AddParams(
          Card.CARD_GENRE.COW_COWBOYS,
          Card.CARD_TYPE.CREATURE,
          2,
          'assets/cards/cow-cowboys/Cow-Bandit-Leader-Card.png',
          'assets/holograms/cow-cowboys/Cow-Leader.png',
          'Prueba\nPrueba'
        )
        break;

      case "Cow-Cowboy":
        newCard.AddParams(
          Card.CARD_GENRE.COW_COWBOYS,
          Card.CARD_TYPE.CREATURE,
          1,
          'assets/cards/cow-cowboys/Cow-MS-Card.png',
          'assets/holograms/cow-cowboys/Cow-Stranger.png',
          'Prueba\nPrueba'
        )
        break;

      case "Milk":
        newCard.AddParams(
          Card.CARD_GENRE.COW_COWBOYS,
          Card.CARD_TYPE.SPELL,
          2,
          'assets/cards/cow-cowboys/Milk-Card.png',
          'assets/holograms/cow-cowboys/Milk.png',
          'Agrega 2 de ataque a la criatura\nde esta zona. \n\nAl inicio del turno,  se destruye\nesta carta.\n\nFlavor'
        )
        break;
      default:
        console.log(cardName + " no existe");
    }
    return newCard;
  }

  CreateDeck(cardArray) {
    for (let i = 0; i < cardArray.length; i++) {
      this.deck[i] = this.CreateCard(cardArray[i]);
    }
  }

  AddCardCount(card) {
    if (this.counts[card.name]) {
      this.counts[card.name]++;
    } else {
      this.counts[card.name] = 1;
    }
  }

  PlayCard(zones, zoneIndex, card) {
    if (this.cardsPlayed < 3) {
      let isPlacementValid = zones[zoneIndex].InsertCard(card);
      if (isPlacementValid) {
        this.AddCardCount(card);
        this.hand.splice(this.hand.indexOf(card), 1);
        if (this.deck.indexOf(card) >= 0) {
          //console.log("card index: " + this.deck.indexOf(card))
          this.deck.splice(this.deck.indexOf(card), 1);
        }
        for (let i = 0; i < zones[zoneIndex].cards.length; i++) {
          if (zones[zoneIndex].cards[i]) {
            console.log("trying effect on zone " + zoneIndex +  " (played card: " + card.name + ")");
            //console.log(card);
            zones[zoneIndex].cards[i].PlayEffect(this, card, zones, zones[zoneIndex]);
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