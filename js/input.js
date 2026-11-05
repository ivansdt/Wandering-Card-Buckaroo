export default class Input {

    static SECTION = {
        HAND: 0,
        ZONES: 1
    }

    constructor() {
        this.keys = new Array();
        this.nodeNumber = 0;
        this.zoneNumber = 0;
        this.lastNode = 0;
        this.lastZone = 0;
        this.onSection = Input.SECTION.HAND;
        this.canSelect = true;
    }

    /*
    OnKeyDown(e) {
        this.keys[e.key] = true;
    }
    */

    OnKeyDown(e, player, battle) {

        if (e.key == "Enter") {
            if (battle.isPlrTurn) {
                if (this.onSection == Input.SECTION.HAND) {
                    this.onSection = Input.SECTION.ZONES;
                    // console.log("selecting zones");
                } else if (this.onSection == Input.SECTION.ZONES) {
                    let wasPlayed = player.PlayCard(battle.plrZones, this.zoneNumber, player.hand[this.nodeNumber]);
                    if (this.nodeNumber >= player.hand.length) {
                        this.lastNode = this.nodeNumber;
                        this.nodeNumber = player.hand.length - 1;
                    }
                    if (wasPlayed) {
                        battle.TurnHandler();
                    }
                    this.SelectingNode(player.hand);
                    this.onSection = Input.SECTION.HAND;
                    // console.log("selecting hand");
                }
            }
        }

        if (this.onSection == Input.SECTION.HAND) {
            if (e.key == "d") {
                if (this.nodeNumber != player.hand.length - 1) {
                    this.lastNode = this.nodeNumber;
                    this.nodeNumber += 1;
                } else {
                    this.nodeNumber = player.hand.length - 1;
                }
                this.SelectingNode(player.hand);
                // console.log(this.nodeNumber);
                // console.log("last node: " + this.lastNode);
            }

            if (e.key == "a") {
                if (this.nodeNumber > 0) {
                    this.lastNode = this.nodeNumber;
                    this.nodeNumber -= 1;
                } else {
                    this.nodeNumber = 0;
                }
                this.SelectingNode(player.hand);
                // console.log(this.nodeNumber);
                // console.log("last node: " + this.lastNode);
            }
        } else if (this.onSection == Input.SECTION.ZONES) {
            if (e.key == "s") {
                if (this.zoneNumber != battle.plrZones.length - 1) {
                    this.lastZone = this.zoneNumber;
                    this.zoneNumber += 1;
                } else {
                    this.zoneNumber = battle.plrZones.length - 1;
                }
                this.SelectingZone(battle.plrZones);
                // console.log(this.zoneNumber);
                // console.log("last zone: " + this.lastZone);
            }

            if (e.key == "w") {
                if (this.zoneNumber > 0) {
                    this.lastZone = this.zoneNumber;
                    this.zoneNumber -= 1;
                } else {
                    this.zoneNumber = 0;
                }
                this.SelectingZone(battle.plrZones);
                // console.log(this.zoneNumber);
                // console.log("last zone: " + this.lastZone);
            }
        }
    }

    SelectingNode(hand) {
        if (hand[this.lastNode]) {
            hand[this.lastNode].isSelected = false;
        }

        if (hand[this.nodeNumber]) {
            hand[this.nodeNumber].isSelected = true;
        }
    }

    SelectingZone(zones) {
        if (zones[this.lastZone]) {
            zones[this.lastZone].isSelected = false;
        }

        if (zones[this.zoneNumber]) {
            zones[this.zoneNumber].isSelected = true;
        }
    }

    ResetNode() {
        this.nodeNumber = 0;
    }
}

