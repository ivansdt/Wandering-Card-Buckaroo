import Game from './game.js';

window.addEventListener('DOMContentLoaded', () => {
    const game = new Game('gameCanvas');
    console.log("CARGANDO FUENTE DE ASEPRITE");
    const aseFont = new FontFace('Aseprite', 'assets/misc/aseprite-font.otf')
    document.fonts.add(aseFont);
    console.log("FUENTE DE ASEPRITE CARGADA");
    game.Start();
});