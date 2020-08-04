import {
    CANVASMARGIN, CANVASWIDTH, CELLWIDTH, DARKSQCOLOR, FILE, NUMFILES,
    NUMRANKS, LIGHTSQCOLOR, POSSIBLESQCOLOR, CASTLEABLESQCOLOR,
    UIFONTBTN
} from '../globals';
import { Cell } from './Cell';

/**
 * Board
 */
export class Board {
    private _canvas_offset_x: number = 0;
    private _canvas_offset_y: number = 0;

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    cells: Cell[] = new Array();
    pieces_img: HTMLImageElement;

    constructor(canvas: HTMLCanvasElement, pieces_img: HTMLImageElement) {

        this.canvas = canvas;
        this.canvas.width = CANVASWIDTH;
        this.canvas.height = CANVASWIDTH;
        this.ctx = canvas.getContext('2d');
        this.pieces_img = pieces_img;

        let boardWidth = NUMFILES * CELLWIDTH,
            boardHeight = NUMRANKS * CELLWIDTH;
        this._canvas_offset_x = (canvas.width - boardWidth) / 2;
        this._canvas_offset_y = CANVASMARGIN; // + 150;

        for (let row = 0; row < NUMRANKS; row++) {
            for (let col = 0; col < NUMFILES; col++) {
                let isLight = (row + col) % 2 ? true : false;
                this.cells.push(new Cell(col, row + 1, isLight));
            }
        }
    }

    private _validateCoord(coord: string) {
        // a valid coordinate is presented as file + rank in a 
        // two character string; e.g. "d4"
        if (coord.length != 2) {
            return false;
        }
        else if (!isNaN(parseInt(coord[0])) || !Object.keys(FILE).includes(coord[0])) {
            return false;
        }
        else {
            let coordRank = parseInt(coord[1]);
            if (isNaN(coordRank) || coordRank > NUMRANKS || coordRank < 1) {
                return false;
            }

            return true;
        }
    }

    cellInBounds(coord: string) {
        return this._validateCoord(coord);
    }

    clearPossible() {
        this.cells.forEach(cell => {
            cell.possibleMove = false;
            cell.castleable = false;
        });
    }

    draw() {
        let lightCol = LIGHTSQCOLOR,
            darkCol = DARKSQCOLOR,
            cellWidth = CELLWIDTH;

        // clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // draw the canvas background
        this.ctx.beginPath()
        this.ctx.fillStyle = '#121212';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.closePath();

        this.cells.forEach(cell => {
            let xPos = (cell.file * cellWidth) + this._canvas_offset_x;
            let yPos = ((NUMRANKS * cellWidth) - (cellWidth * (cell.rank - 1)) - cellWidth) + this._canvas_offset_y;

            // draw the cell
            this.ctx.beginPath();
            this.ctx.fillStyle = cell.isLight ? lightCol : darkCol;

            // highlight the active piece
            if (cell.isOccupied() && cell.piece.active) {
                this.ctx.fillStyle = POSSIBLESQCOLOR;
            }

            this.ctx.fillRect(xPos, yPos, cellWidth, cellWidth);
            this.ctx.closePath();

            // draw axis labels
            this.ctx.beginPath();
            this.ctx.fillStyle = cell.isLight ? darkCol : lightCol;
            this.ctx.font = UIFONTBTN;
            if (cell.rank == 1) {
                this.ctx.fillText(FILE[cell.file], (xPos + cellWidth - 10), (yPos + cellWidth - 5));
            }
            if (cell.file == FILE.a) {
                this.ctx.fillText(cell.rank + '', xPos + 3, yPos + 15);
            }
            this.ctx.closePath();

            // highlight possible moves
            if (cell.possibleMove) {
                // offset by half lineWidth so highlight fits within square
                let lineWidth = 6,
                    pxPos = xPos + (lineWidth * 0.5),
                    pyPos = yPos + (lineWidth * 0.5),
                    pCellWidth = cellWidth - lineWidth;

                this.ctx.beginPath();
                this.ctx.lineWidth = lineWidth;
                this.ctx.strokeStyle = POSSIBLESQCOLOR;

                if (cell.castleable) {
                    this.ctx.strokeStyle = CASTLEABLESQCOLOR;
                }

                this.ctx.rect(pxPos, pyPos, pCellWidth, pCellWidth);
                this.ctx.stroke();
                this.ctx.closePath();
            }

            // draw any pieces occupying this cell
            if (cell.isOccupied()) {
                cell.piece.draw(this.pieces_img, this.ctx, xPos, yPos, cellWidth);
            }
        });
    }

    getCellByCoord(coord: string) {
        if (!this._validateCoord(coord)) {
            // console.error('Board.getCellByCoord: invalid coord value.');
            return;
        }

        let file = coord[0];
        let rank = parseInt(coord[1]);
        let index = ((rank * NUMFILES) - NUMRANKS) + FILE[file];

        return this.cells[index];
    }

    getCellByPixels(xPos: number, yPos: number) {
        let file = FILE[Math.floor((xPos - this._canvas_offset_x) / CELLWIDTH)];
        let rank = NUMRANKS - Math.floor((yPos - this._canvas_offset_y) / CELLWIDTH);

        return this.getCellByCoord("" + file + rank);
    }
}