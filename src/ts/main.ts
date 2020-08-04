import '../css/styles.css';
import '../css/typechess.css';
import * as config from './config.json';
import { Typechess } from './lib/Typechess';


/**
 * Start
 */
window.addEventListener('load', (load_event) => {
    let canvas = document.getElementById(config.canvasId) as HTMLCanvasElement,
        match = null,
        pieces = document.getElementById(config.piecesImgId) as HTMLImageElement,
        ui_div = document.getElementById(config.uiId) as HTMLDivElement;

    match = new Typechess(canvas, pieces, ui_div, false);
    match.draw();

    canvas.addEventListener('click', (event) => {
        match.click(event);
    });
});
