export default class Entity {
  constructor(name) {
    this.name = name;
    this.deck = new Array(20);
    this.sprite;
  }
}