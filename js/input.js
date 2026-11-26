import Battle from './battle.js';

export default class Input {

    static SECTION = {
        HAND: 0,
        ZONES: 1,
        INDEX: 2,
    }

    static GAME_STATES = {
        PLAY: "PLAY",
        PAUSE: "PAUSE",
        WIN: "WIN",
        LOSE: "LOSE",
        TITLE: "TITLE",
        TUTORIAL: "TUTORIAL",
    }


    constructor() {
        this.keys = new Array();
        this.nodeNumber = 0;
        this.zoneNumber = 0;
        this.lastNode = 0;
        this.lastZone = 0;
        this.onSection = Input.SECTION.HAND;
        this.canSelect = true;
        this.lastState;
        this.gameState = Input.GAME_STATES.TITLE;
        this.onButton;
        this.lastButton;
        this.lastSection;
    }

    /*
    OnKeyDown(e) {
        this.keys[e.key] = true;
    }
    */

    OnKeyDown(e, game, player, battle) {
        if (this.gameState == Input.GAME_STATES.TITLE) {

            if (e.key == "s") {
                this.SelectingButton(game.tutorialButton);
            }
            if (e.key == "w") {
                this.SelectingButton(game.playButton);
            }

            if (e.key == "Enter") {
                if (this.onButton == game.playButton) {
                    this.lastState = this.gameState;
                    this.gameState = Input.GAME_STATES.PLAY;
                    game.CreateBattle();
                } else if (this.onButton == game.tutorialButton) {
                    this.lastState = this.gameState;
                    this.gameState = Input.GAME_STATES.TUTORIAL;
                }
            }
        }

        else if (this.gameState == Input.GAME_STATES.TUTORIAL) {
            if (e.key == "Enter" || e.key == "Escape") {
                if (this.lastState == Input.GAME_STATES.PAUSE) {
                    this.lastState = this.gameState;
                    this.gameState = Input.GAME_STATES.PAUSE;
                } else {
                    this.lastState = this.gameState;
                    this.gameState = Input.GAME_STATES.TITLE;
                }
            }
        }

        else if (this.gameState == Input.GAME_STATES.WIN || this.gameState == Input.GAME_STATES.LOSE) {
            if (e.key == "Escape") {
                console.log("GOING BACK TO MENU");
                game.player = null;
                game.rival = null;
                game.battle = null;
                this.lastState = this.gameState;
                this.gameState = Input.GAME_STATES.TITLE;
            }
        }

        else if (this.gameState == Input.GAME_STATES.PLAY || this.gameState == Input.GAME_STATES.PAUSE) {
            if (e.key == "Escape") {
                this.TogglePause();
            }
            if (this.gameState == Input.GAME_STATES.PLAY) {

                if (battle && battle.isPlrTurn) {
                    if (e.key == "Enter") {
                        if (battle.isPlrTurn) {
                            if (this.onSection == Input.SECTION.HAND) {
                                this.lastSection == Input.SECTION.HAND;
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
                                } else {
                                    game.player.hand[this.nodeNumber].transparent = false;
                                }
                                this.SelectingNode(player.hand);
                                this.lastSection == Input.SECTION.ZONES;
                                this.onSection = Input.SECTION.HAND;
                                // console.log("selecting hand");
                            }
                        }
                    }

                    if ((e.key == "e" || e.key == "E") && battle.state == Battle.DUEL_STATE.PLAYING) {
                        if (this.onSection != Input.SECTION.INDEX) {
                            this.lastSection = this.onSection
                            this.onSection = Input.SECTION.INDEX;
                        } else {
                            this.onSection = this.lastSection
                            this.lastSection = Input.SECTION.INDEX;
                        }
                    }

                    if (this.onSection == Input.SECTION.HAND) {
                        if (e.key == "r" || e.key == "R") {
                            this.ResetNode();
                            battle.SkipTurn();
                        }

                        if (e.key == "d" || e.key == "D") {
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

                        if (e.key == "a" || e.key == "A") {
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
                        this.SelectingZone(battle.plrZones, game.player.hand);

                        if (e.key == "Backspace") {
                            this.onSection = Input.SECTION.HAND;
                            game.player.hand[this.nodeNumber].transparent = false;
                        }

                        if (e.key == "s" || e.key == "S") {
                            if (this.zoneNumber != battle.plrZones.length - 1) {
                                this.lastZone = this.zoneNumber;
                                this.zoneNumber += 1;
                            } else {
                                this.zoneNumber = battle.plrZones.length - 1;
                            }
                            this.SelectingZone(battle.plrZones, game.player.hand);
                            // console.log(this.zoneNumber);
                            // console.log("last zone: " + this.lastZone);
                        }

                        if (e.key == "w" || e.key == "W") {
                            if (this.zoneNumber > 0) {
                                this.lastZone = this.zoneNumber;
                                this.zoneNumber -= 1;
                            } else {
                                this.zoneNumber = 0;
                            }
                            this.SelectingZone(battle.plrZones, game.player.hand);
                            // console.log(this.zoneNumber);
                            // console.log("last zone: " + this.lastZone);
                        }
                    }
                }
            } else if (this.gameState == Input.GAME_STATES.PAUSE) {
                if (e.key == "r" || e.key == "R") {
                    game.player = null;
                    game.rival = null;
                    game.battle = null;
                    this.lastState = this.gameState;
                    this.onSection = Input.SECTION.HAND;
                    this.gameState = Input.GAME_STATES.PLAY;
                    game.CreateBattle();
                }

                if (e.key == "m" | e.key == "M") {
                    game.player = null;
                    game.rival = null;
                    game.battle = null;
                    this.lastState = this.gameState;
                    this.gameState = Input.GAME_STATES.TITLE;
                }


                if (e.key == "t" | e.key == "T") {
                    this.lastState = this.gameState;
                    this.gameState = Input.GAME_STATES.TUTORIAL;
                }
            }
        }
    }

    TogglePause() {
        if (this.gameState == Input.GAME_STATES.PAUSE) {
            this.lastState = this.gameState;
            this.gameState = Input.GAME_STATES.PLAY
        } else {
            this.lastState = this.gameState;
            this.gameState = Input.GAME_STATES.PAUSE
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

    SelectingZone(zones, hand) {
        if (zones[this.lastZone]) {
            zones[this.lastZone].isSelected = false;
            if (this.zoneNumber < 3) {
                hand[this.nodeNumber].transparent = false;
            }
        }

        if (zones[this.zoneNumber]) {
            zones[this.zoneNumber].isSelected = true;
            if (this.zoneNumber > 2 && this.nodeNumber <= hand.length / 2 - 1) {
                hand[this.nodeNumber].transparent = true;
            }
        }
    }

    SelectingButton(button) {
        this.lastButton = this.onButton;
        this.lastButton.isSelected = false;
        this.onButton = button;
        this.onButton.isSelected = true;
    }

    ResetNode() {
        this.nodeNumber = 0;
    }

    ResetZone() {
        this.zoneNumber = 0;
    }
}

