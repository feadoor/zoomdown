import React, { useState, KeyboardEvent as KEvent } from 'react';
import './ConundrumRound.css';

import { CountdownGame, ConundrumRound } from '../../game/game';
import { CountdownAction, solveConundrum, endRound } from '../../game/actions';
import { getCurrentRound, getP1TotalScore, getP2TotalScore } from '../../game/selectors';
import useConundrum, { ConundrumRoundState } from '../../hooks/useConundrum';
import Selection from '../Selection/Selection';
import Timer from '../Timer/Timer';
import useEventListener from '../../hooks/useEventListener';

export interface ConundrumRoundProps {
    game: CountdownGame;
    dispatch: (_: CountdownAction) => void;
}

const ConundrumRoundComponent: React.FC<ConundrumRoundProps> = ({game, dispatch}) => {

    const round = getCurrentRound(game) as ConundrumRound;

    const [p1Declaration, setP1Declaration] = useState('');
    const [p2Declaration, setP2Declaration] = useState('');

    const initialRoundState = () => {
        if (round.solved) return ConundrumRoundState.SOLVED;
        else return ConundrumRoundState.WAITING;
    };
    const { roundState, startRound, buzz, resume, p1HasDeclared, declareForP1, p2HasDeclared, declareForP2, timeRemaining } = useConundrum(initialRoundState(), dispatch, round.answer);

    const selectionToShow = () => {
        if (roundState === ConundrumRoundState.WAITING || roundState === ConundrumRoundState.GUESSING) return emptySelection();
        else if (roundState === ConundrumRoundState.INCORRECT) return incorrectSelection();
        else if (roundState === ConundrumRoundState.EXPIRED && !round.solved && p1HasDeclared && p2HasDeclared) return incorrectSelection();
        else return getSelection(round);
    };

    const showBuzzer = roundState === ConundrumRoundState.TICKING && !round.solved && (!p1HasDeclared || !p2HasDeclared);
    const showReveal = roundState === ConundrumRoundState.EXPIRED && !round.solved;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.keyCode === 32) {
            if (roundState === ConundrumRoundState.WAITING) startRound();
            else if (roundState === ConundrumRoundState.INCORRECT) resume();
            else if (showBuzzer) buzz();
            else if (showReveal) dispatch(solveConundrum());
            else if (round.solved) dispatch(endRound());
        }
    }

    const handleP1KeyDown = (e: KEvent) => {
        if (e.keyCode === 13) {
            declareForP1(p1Declaration);
        }
        e.stopPropagation();
    }

    const handleP2KeyDown = (e: KEvent) => {
        if (e.keyCode === 13) {
            declareForP2(p2Declaration);
        }
        e.stopPropagation();
    }

    useEventListener('keydown', handleKeyDown);

    return (
        <div className="conundrum-round">
            <div className="game__score">{game.p1Name} {getP1TotalScore(game)} - {getP2TotalScore(game)} {game.p2Name}</div>
            <div className="game__round-description">Round {game.rounds.length}: Conundrum</div>
            <div className="game__selection">
                <Selection selection={selectionToShow()}></Selection>
            </div>
            <div className="conundrum-round__timer">
                <Timer durationSeconds={30} secondsRemaining={Math.max(0, timeRemaining - 2)}></Timer>
            </div>
            {roundState === ConundrumRoundState.WAITING && <div className="conundrum-round__pick-actions">
                <button className="button--green" onClick={startRound}>Reveal conundrum</button>
            </div>}
            {showBuzzer && <div className="conundrum-round__buzzer">
                <button className="button--red conundrum-round__buzz" onClick={() => buzz()}>Buzz!</button>
            </div>}
            {roundState === ConundrumRoundState.INCORRECT && <div className="conundrum-round__resume">
                <button className="button--green conundrum-round__resume" onClick={() => resume()}>Resume</button>
            </div>}
            {roundState === ConundrumRoundState.GUESSING && <div className="conundrum-round__declarations">
                <div className="conundrum-round__declaration">
                    <div className="conundrum-round__name">{game.p1Name}</div>
                    <input disabled={p1HasDeclared} type="text" value={p1Declaration} onKeyDown={e => handleP1KeyDown(e)} onChange={e => setP1Declaration(e.target.value.toUpperCase())}></input>
                    <button className="button--green" disabled={p1HasDeclared} onClick={() => declareForP1(p1Declaration)}>Submit</button>
                </div>
                <div className="conundrum-round__declaration">
                    <div className="conundrum-round__name">{game.p2Name}</div>
                    <input disabled={p2HasDeclared} type="text" value={p2Declaration} onKeyDown={e => handleP2KeyDown(e)} onChange={e => setP2Declaration(e.target.value.toUpperCase())}></input>
                    <button className="button--green" disabled={p2HasDeclared} onClick={() => declareForP2(p2Declaration)}>Submit</button>
                </div>
            </div>}
            {showReveal && <div className="conundrum-round__solve-button">
                <button className="button--green" onClick={() => dispatch(solveConundrum())}>Reveal answer</button>
            </div>}
            {(roundState === ConundrumRoundState.SOLVED || roundState === ConundrumRoundState.EXPIRED) && round.solved && <div className="conundrum-round__results">
                {round.p1Score > 0 && <span>Solved by {game.p1Name}!</span>}
                {round.p2Score > 0 && <span>Solved by {game.p2Name}!</span>}
                {round.p1Score === 0 && round.p2Score === 0 && <span>No-one solved it!</span>}
                <button className="button--blue" onClick={() => dispatch(endRound())}>End round</button>
            </div>}
        </div>
    );
};

export default ConundrumRoundComponent;

const emptySelection = () => ['', '', '', '', '', '', '', '', ''];

const incorrectSelection = () => ['I', 'N', 'C', 'O', 'R', 'R', 'E', 'C', 'T'];

const getSelection = (round: ConundrumRound) => {
    if (round.scramble === undefined) return emptySelection();
    else if (!round.solved) return [...round.scramble];
    else return [...round.answer];
};
