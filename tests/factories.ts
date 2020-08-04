import { FILE, NUMRANKS, SIDE } from '../src/ts/globals';
import { Board } from '../src/ts/lib/Board';
import { Cell } from '../src/ts/lib/Cell';
import { ChessUi } from '../src/ts/lib/ui/ChessUi';
import { Pawn } from '../src/ts/lib/pieces/Pawn';
import { Typechess } from '../src/ts/lib/Typechess';


/**
 * Board Factory
 */
export const BoardFactory = function () {
    const jsdom = require('jsdom');
    const { JSDOM } = jsdom;
    let dom = new JSDOM(`<!DOCTYPE html><canvas id="test_canvas" width="640" height="640"></canvas><img id="test_img">`),
        document = dom.window.document;

    return new Board(document.getElementById('test_canvas'), document.getElementById('test_img'));
};

/**
 * Cell Factory
 */
export const CellFactory = function (params?: any) {
    let rndFile: FILE = Math.floor(Math.random() * (Object.keys(FILE).length / 2)),
        rndRank: number = Math.floor(Math.random() * NUMRANKS) + 1,
        rndLight: boolean = (rndFile * rndRank) % 2 == 0,
        cell: Cell = new Cell(rndFile, rndRank, rndLight);

    if (params != null) {
        if (params.hasOwnProperty('file'))
            cell.file = params.file;

        if (params.hasOwnProperty('rank'))
            cell.rank = params.rank;

        if (params.hasOwnProperty('isLight'))
            cell.isLight = params.isLight;
    }

    return cell;
};

/**
 * ChessUi Factory
 */
export const ChessUiFactory = function (params?: any) {
    const jsdom = require('jsdom');
    const { JSDOM } = jsdom;
    let dom = new JSDOM(`<!DOCTYPE html><div id="chess_ui"></div>`),
        document = dom.window.document;

    return new ChessUi(document.getElementById('chess_ui'));
};

/**
 * Piece Factory
 */
export const PieceFactory = function (customSide?: SIDE) {
    let side = customSide ? customSide
        : (Math.floor(Math.random() * 2) + 1 == 1 ? SIDE.white : SIDE.black);
    // let type = PIECETYPE[Math.floor(Math.random() * Object.keys(PIECETYPE).length) + 1];

    return new Pawn(side, 0);
};

/**
 * Chess960 Factory
 */

export const Chess960Factory = function () {
    const { JSDOM } = require('jsdom');
    let dom = new JSDOM(`<!DOCTYPE html><div id="chess_ui"></div><canvas id="chess_board"></canvas><img id="pieces_img" src="./pieces.png" class="hidden">`),
        document = dom.window.document;
    return new Typechess(document.getElementById("chess_board"), document.getElementById("pieces_img"), document.getElementById("chess_ui"), true)
}