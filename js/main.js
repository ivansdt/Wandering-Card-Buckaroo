import Game from './game.js';

window.addEventListener('DOMContentLoaded', async () => {
    const game = new Game('gameCanvas');
    console.log("CARGANDO FUENTE DE ASEPRITE");
    const aseFont = new FontFace('Aseprite', 'url(assets/misc/aseprite-font.otf)')
    const loadedFont = await aseFont.load();
    document.fonts.add(loadedFont);
    console.log("FUENTE DE ASEPRITE CARGADA");
    game.Start();
});