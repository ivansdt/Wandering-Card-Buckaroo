import Game from './game.js';

window.addEventListener('DOMContentLoaded', () => {
    const game = new Game('gameCanvas');
    const aseFont = new FontFace('Aseprite', 'assets/misc/aseprite-font.otf')
    document.fonts.add(aseFont);
    game.Start();
});