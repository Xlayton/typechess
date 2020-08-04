import { CAPITALIZE, FILE, GETENUMKEY, PIECESPRITEWIDTH, PIECETYPE, SIDE } from '../../globals';
import { Board } from '../Board';
import { Cell } from '../Cell';

export abstract class Piece {
    // protected
    // protected _cell: Cell = null;
    protected _coord: string = '';
    protected _forward = 1;
    protected _id: number;

    // public
    active = false;
    captured = false;
    possibleMoves = new Array();
    side = SIDE.white;
    type = PIECETYPE.pawn;
    value = 100;

    constructor(side: SIDE, type: PIECETYPE, id: number) {
        this.side = side;
        this.type = type;
        this._forward = this.side == SIDE.white ? 1 : -1; // -1 = down, 1 = up
        this._id = id;
    }

    private _iterateMoves(board: Board, coord: string, incFile: number, incRank: number) {
        let moves = new Array();

        while (board.cellInBounds(coord)) {
            let file = FILE[coord[0]];
            let rank = parseInt(coord[1]);
            let nextFile = file + incFile;
            let nextRank = rank + incRank;

            if (coord != this.getCoord()) {
                let cell = board.getCellByCoord(coord);

                if (cell.isOccupied()) {
                    if (cell.piece.side != this.side) {
                        moves.push(coord);
                        cell.possibleMove = true;
                    }

                    break;
                }

                moves.push(coord);
                cell.possibleMove = true;
            }

            coord = "" + FILE[nextFile] + (nextRank);
        }

        return moves;
    }

    canMove(board: Board) {
        console.error("Piece.canMove: canMove has not been implemented!");
        return [];
    }

    draw(img: HTMLImageElement, ctx: CanvasRenderingContext2D, xPos: number, yPos: number, cellWidth: number) {
        let clipX = img.naturalWidth - (this.type * PIECESPRITEWIDTH),
            clipY = this.side == SIDE.white ? 0 : PIECESPRITEWIDTH,
            clipWidth = PIECESPRITEWIDTH,
            clipHeight = PIECESPRITEWIDTH;

        ctx.drawImage(img, clipX, clipY, clipWidth, clipHeight,
            xPos, yPos, cellWidth, cellWidth);
    }

    getCoord() {
        return this._coord;
    }

    getDiagMoves(board: Board, forward: boolean, right: boolean) {
        let coord = this.getCoord(),
            incFile = right ? 1 : -1,
            incRank = (forward ? 1 : -1) * this._forward;

        return this._iterateMoves(board, coord, incFile, incRank);
    }
    getId() {
        return this._id;
    }

    getPerpMoves(board: Board, vertical: boolean, positive: boolean) {
        let coord = this.getCoord(),
            incFile = !vertical ? (positive ? 1 : -1) : 0,
            incRank = vertical ? (positive ? 1 : -1) * this._forward : 0;

        return this._iterateMoves(board, coord, incFile, incRank);
    }

    getPieceType() {
        return CAPITALIZE(GETENUMKEY(PIECETYPE, this.type));
    }

    getSide() {
        return CAPITALIZE(GETENUMKEY(SIDE, this.side));
    }

    overrideCoord(coord: string) {
        this._coord = coord;
    }

    move(cell: Cell) {
        // check if I can be moved to this cell...
        if (cell instanceof Cell && this.possibleMoves.includes(cell.getCoord())) {
            this._coord = cell.getCoord();
            cell.piece = this;
            this.possibleMoves = [];

            return true;
        }

        return false;
    }

    setupMove(cell: Cell) {
        if (!cell.isOccupied()) {
            this._coord = cell.getCoord();
            cell.piece = this;
            this.possibleMoves = [];

            return true;
        }
        return false;
    }
}