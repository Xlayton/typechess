import 'mocha'
import { Chess960Factory } from './factories'
import { Typechess } from '../src/ts/lib/Typechess'
import { expect } from 'chai'
import { PIECETYPE, FILE } from '../src/ts/globals'

describe('Test Chess960', () => {
    let game: Typechess

    before(() => {
        game = Chess960Factory();
    })

    it('should be constructable', () => expect(game).to.be.instanceOf(Typechess));

    it('should have placed all pieces', () => {
        expect(game.match.getBlackTeam().pieces.filter(val => val.getCoord()).length).to.equal(16)
        expect(game.match.getWhiteTeam().pieces.filter(val => val.getCoord()).length).to.equal(16)
    });


    it('should put opposing peices in same rank', () => {
        expect(game.match.getBlackTeam().pieces.filter(piece => piece.type === PIECETYPE.king)[0].getCoord()[0]).to.equal(game.match.getWhiteTeam().pieces.filter(piece => piece.type === PIECETYPE.king)[0].getCoord()[0])
        expect(game.match.getBlackTeam().pieces.filter(piece => piece.type === PIECETYPE.queen)[0].getCoord()[0]).to.equal(game.match.getWhiteTeam().pieces.filter(piece => piece.type === PIECETYPE.queen)[0].getCoord()[0])
        expect(game.match.getBlackTeam().pieces.filter(piece => piece.type === PIECETYPE.rook)[0].getCoord()[0]).to.equal(game.match.getWhiteTeam().pieces.filter(piece => piece.type === PIECETYPE.rook)[0].getCoord()[0])
        expect(game.match.getBlackTeam().pieces.filter(piece => piece.type === PIECETYPE.rook)[1].getCoord()[0]).to.equal(game.match.getWhiteTeam().pieces.filter(piece => piece.type === PIECETYPE.rook)[1].getCoord()[0])
        expect(game.match.getBlackTeam().pieces.filter(piece => piece.type === PIECETYPE.bishop)[0].getCoord()[0]).to.equal(game.match.getWhiteTeam().pieces.filter(piece => piece.type === PIECETYPE.bishop)[0].getCoord()[0])
        expect(game.match.getBlackTeam().pieces.filter(piece => piece.type === PIECETYPE.bishop)[1].getCoord()[0]).to.equal(game.match.getWhiteTeam().pieces.filter(piece => piece.type === PIECETYPE.bishop)[1].getCoord()[0])
        expect(game.match.getBlackTeam().pieces.filter(piece => piece.type === PIECETYPE.knight)[0].getCoord()[0]).to.equal(game.match.getWhiteTeam().pieces.filter(piece => piece.type === PIECETYPE.knight)[0].getCoord()[0])
        expect(game.match.getBlackTeam().pieces.filter(piece => piece.type === PIECETYPE.knight)[1].getCoord()[0]).to.equal(game.match.getWhiteTeam().pieces.filter(piece => piece.type === PIECETYPE.knight)[1].getCoord()[0])
    })

    it('should still put peices in appropiate file', () => {
        game.match.getWhiteTeam().pieces.filter(piece => piece.type !== PIECETYPE.pawn).forEach(nonPawn => expect(nonPawn.getCoord()[1]).to.equal('1'))
        game.match.getWhiteTeam().pieces.filter(piece => piece.type === PIECETYPE.pawn).forEach(pawn => expect(pawn.getCoord()[1]).to.equal('2'))

    })
    it('should put a rook on either side of the king', () => {
        let rooks = game.match.getWhiteTeam().pieces.filter(piece => piece.type === PIECETYPE.rook);
        let king = game.match.getWhiteTeam().pieces.find(piece => piece.type === PIECETYPE.king);
        expect(FILE[rooks[0].getCoord()[0]]).greaterThan(FILE[king.getCoord()[0]])
        expect(FILE[rooks[1].getCoord()[0]]).lessThan(FILE[king.getCoord()[0]])
    });

    it('should put bishops on alternate colors', () => {
        let bishops = game.match.getWhiteTeam().pieces.filter(piece => piece.type === PIECETYPE.bishop);
        expect(FILE[bishops[0].getCoord()[0]] % 2).equal(1)
        expect(FILE[bishops[1].getCoord()[0]] % 2).equal(0)
    })
})