import { CELLWIDTH, FILE } from '../src/ts/globals';
import { CellFactory, BoardFactory, PieceFactory } from './factories';
import { Piece } from '../src/ts/lib/pieces/_Piece';
import { expect } from 'chai';
import 'mocha';

/**
 * Piece Tests
 */
describe('Test Piece', () => {
    it('should be constructable', () => {
        let piece = PieceFactory();
        expect(piece).to.be.instanceOf(Piece);
    });

    describe('draw()', () => {
        let img: HTMLImageElement,
            ctx: CanvasRenderingContext2D,
            xPos: number,
            yPos: number,
            cellWidth: number = CELLWIDTH,
            document: any;

        before(() => {
            const jsdom = require('jsdom');
            const { JSDOM } = jsdom;
            let canvas;
            let dom = new JSDOM(`<!DOCTYPE html><canvas id="test_canvas" width="100" height="100"></canvas><img id="test_img" src="pieces.png">`, {
                resources: 'usable',
                url: 'file:///D:/_dev/Existing/typechess/dist/'
            });

            document = dom.window.document,
                canvas = document.getElementById('test_canvas');
            img = document.getElementById('test_img');
            ctx = canvas.getContext('2d');
            xPos = Math.floor(Math.random() * canvas.width);
            yPos = Math.floor(Math.random() * canvas.height);
        });

        it('it should be able to draw without errors', (done) => {
            let piece = PieceFactory(),
                err: Error;

            document.addEventListener('load', () => {
                try {
                    piece.draw(img, ctx, xPos, yPos, cellWidth);
                }
                catch (e) {
                    err = e;
                    // console.log(e);
                }

                expect(err).to.equal(undefined);
                done();
            });
        });
    });

    describe('getPieceType()', () => {
        it('should return a human-readable string of the piece\'s type', () => {
            let piece = PieceFactory();
            expect(piece.getPieceType()).to.equal("Pawn");
        });
    });
    describe('getSide()', () => {
        it('should return a human-readable string of the piece\'s side', () => {
            let piece = PieceFactory();
            expect(piece.getSide()).to.satisfy(output => {
                return !!(output == "White" || output == "Black");
            });
        });
    });


    describe('move()', () => {
        let piece = PieceFactory();

        it('should relocate the piece if provided a valid Cell instance', () => {
            let cell = CellFactory();
            piece.possibleMoves = [cell.getCoord()];
            piece.move(cell);
            expect(piece.getCoord()).to.equal(cell.getCoord());
        });
        it('should return false if the Cell appears invalid', () => {
            let cell = CellFactory(),
                res: boolean = true;
            piece.possibleMoves = [];
            res = piece.move(cell);
            expect(res).to.be.false;
        });
        it('should remove previous reference to occupied cell after moving', () => {
            let cell = CellFactory();
            expect(piece.getCoord()).to.not.equal(cell.getCoord());
            piece.possibleMoves = [cell.getCoord()];
            piece.move(cell);
            expect(piece.getCoord()).to.equal(cell.getCoord());
        });
        it('should clear possible moves', () => {
            let cell = CellFactory();
            piece.possibleMoves = [cell.getCoord()];
            piece.move(cell);
            expect(piece.possibleMoves.length).to.equal(0);
        });
    });
    describe('getCoord()', () => {
        it('should return the file-first coord of the cell which it occupies', () => {
            let cell = CellFactory(),
                piece = PieceFactory();
            piece.possibleMoves = [cell.getCoord()];
            piece.move(cell);
            expect(piece.getCoord()).to.equal(cell.getCoord());
        });
        it('should reutrn an empty string if it does not occupy a cell', () => {
            let piece = PieceFactory();
            expect(piece.getCoord()).to.equal('');
        })
    });
    describe('getDiagMoves()', () => {
        it('should return an array of coordinates conforming to a forward right diagonal line', () => {
            let piece = PieceFactory(),
                cell = CellFactory({ file: FILE.a, rank: 2 }),
                board = BoardFactory(),
                res: string[] = new Array();

            piece.move(cell);
            res = piece.getDiagMoves(board, true, true);
            expect(res.length).to.be.greaterThan(0);
        });
    });
});
