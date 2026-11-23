import Card from './card.js';

export default class Entity {
  constructor(name, spriteSrc) {
    this.name = name;
    this.life = 10;
    this.deck = new Array();
    this.hand = new Array();
    this.sprite = new Image();
    this.sprite.src = spriteSrc
    this.cardsPlayed = 0;
    this.counts = {};
    this.x;
    this.y;
    this.sizeX;
    this.sizeY;
    this.scaleX = 1.0;
    this.scaleY = 1.0;
    this.idleTimer = Math.random() * Math.PI * 2;
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
          'Pierde 1 de valor por criatura\n"cowboy" en tu campo. \n\nForma vaca: Pierde 2 de ataque.\nGana 2 de ataque por criatura\n"Mysterious stranger" en forma \nvaca en tu campo.',
          'Un misterioso trotamundos,  maldito\npor la luna de queso.' // flavor
        )
        break;

      case "Bandit Leader":
        newCard.AddParams(
          Card.CARD_GENRE.COW_COWBOYS,
          Card.CARD_TYPE.CREATURE,
          2,
          'assets/cards/cow-cowboys/Bandit-Leader-Card.png',
          'assets/holograms/cow-cowboys/Bandit-Leader-Side.png',
          'Al inicio del turno pon un Goon en\ntu mano.\n\nForma vaca: Al inicio del turno,  pon\nun Cow Goon en tu mano.',
          'Un peligroso bandido, que lidera su grupo\nen busca de venganza contra los lords\ndel queso.'
        )
        break;

      case "Big Iron":
        newCard.AddParams(
          Card.CARD_GENRE.COW_COWBOYS,
          Card.CARD_TYPE.OBJECT,
          5,
          'assets/cards/cow-cowboys/Big-Iron-Card.png',
          'assets/holograms/cow-cowboys/Big-Iron.png',
          'Otorga 5 de valor a la criatura\nen esta zona,  pero esta se destruye\nal inicio del turno,  despues\nde realizar sus efectos si tiene.',
          'Una arma demasaido grande para sostener\nnormalmente. Su retroceso es tal que mata a\ncualquier ser tan valiente para usarlo.'
        )
        break;

      case "Cheese Moon":
        newCard.AddParams(
          Card.CARD_GENRE.COW_COWBOYS,
          Card.CARD_TYPE.SPELL,
          0,
          'assets/cards/cow-cowboys/Cheese-Full-Moon-Card.png',
          'assets/holograms/cow-cowboys/Cheese-Full-Moon.png',
          'Convierte todas las criaturas\n"cowboy" en tu campo en su forma\n"vaca".',
          'Los lords del queso hartados por la codicia\ndel este,  impusieron la maldicion de la luna\nsobre sus habitantes,  solo aquellos con la\nmayor voluntad pueden resistirla.'
        )
        break;

      case "Goon":
        newCard.AddParams(
          Card.CARD_GENRE.COW_COWBOYS,
          Card.CARD_TYPE.CREATURE,
          1,
          'assets/cards/cow-cowboys/Goon-Card.png',
          'assets/holograms/cow-cowboys/Goons-Side.png',
          'Si no hay criaturas de "Bandit\nLeader" en tu deck convierte esta\ncriatura en "Bandit Leader"\n\nForma vaca: Pierde 1 de ataque.\nAl inicio del turno otorga un hechizo\nde "Milk" a tu mano.',
          'Un gamberro tipico. Esta aqui por las\namistades y el dinero.'
        )
        break;

      case "Cheese Amulet":
        newCard.AddParams(
          Card.CARD_GENRE.COW_COWBOYS,
          Card.CARD_TYPE.OBJECT,
          0,
          'assets/cards/cow-cowboys/Cheese-Amulet-Card.png',
          'assets/holograms/cow-cowboys/Cheese-Amulet.png',
          'Convierte las criaturas "cowboy" \nen esta zona en su forma "vaca".',
          'Un amuleto capaz de replicar los efectos\nde la luna de queso a voluntad.'
        )
        break;

      case "Sheriff Badge":
        newCard.AddParams(
          Card.CARD_GENRE.COW_COWBOYS,
          Card.CARD_TYPE.OBJECT,
          2,
          'assets/cards/cow-cowboys/Sherrif-badge-card.png',
          'assets/holograms/cow-cowboys/Sheriff-Badge.png',
          'Duplica el ataque de la criaturas en\nesta zona.',
          'Una medalla que en los viejos tiempos\nrepresentaba la ley.\nHoy en dia solo duplica el ataque.'
        )
        break;

      case "Cow Goon":
        newCard.AddParams(
          Card.CARD_GENRE.COW_COWBOYS,
          Card.CARD_TYPE.CREATURE,
          0,
          'assets/cards/cow-cowboys/Cow-Goon-Card.png',
          'assets/holograms/cow-cowboys/Cow-Goons.png',
          'Forma vaca: pierde 1 de ataque.\n\nAl inicio del turno otorga una carta\nde "Milk"a tu mano.',
          'Un duo de vacas normales.\nCuriosamente tienen sombreros familiares.'
        )
        break;

      case "Herd Leader":
        newCard.AddParams(
          Card.CARD_GENRE.COW_COWBOYS,
          Card.CARD_TYPE.CREATURE,
          2,
          'assets/cards/cow-cowboys/Cow-Bandit-Leader-Card.png',
          'assets/holograms/cow-cowboys/Cow-Leader.png',
          'Prueba\nPrueba',
          'Flavor'
        )
        break;

      case "Cow-Cowboy":
        newCard.AddParams(
          Card.CARD_GENRE.COW_COWBOYS,
          Card.CARD_TYPE.CREATURE,
          1,
          'assets/cards/cow-cowboys/Cow-MS-Card.png',
          'assets/holograms/cow-cowboys/Cow-Stranger.png',
          'Prueba\nPrueba',
          'Flavor'
        )
        break;

      case "Milk":
        newCard.AddParams(
          Card.CARD_GENRE.COW_COWBOYS,
          Card.CARD_TYPE.SPELL,
          2,
          'assets/cards/cow-cowboys/Milk-Card.png',
          'assets/holograms/cow-cowboys/Milk.png',
          'Agrega 2 de ataque a la criatura\nde esta zona. \n\nAl inicio del turno,  se destruye\nesta carta.',
          'Te hace crecer grande y fuerte\n(Este mensaje fue promocionado por LaLe)'
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
            console.log("trying effect on zone " + zoneIndex + " (played card: " + card.name + ")");
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

  Update(dt) {
    this.idleTimer += dt * 2;

    let breathe = Math.sin(this.idleTimer) * 0.035;
    this.scaleY = 1.0 + breathe;
    this.scaleX = 1.0 - breathe * 0.5;
  }

  Draw(ctx) {
    ctx.save();
    //ctx.translate(this.x  - (this.scaleX * 10), this.y);
    //console.log(this.scaleY);
    ctx.drawImage(this.sprite, this.x + (this.sizeX - (this.sizeX * this.scaleX)) / 2, this.y + (this.sizeY - (this.sizeY * this.scaleY)), this.sizeX * this.scaleX, this.sizeY * this.scaleY);
    ctx.restore();
  }
}