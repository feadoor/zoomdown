import React, { useState } from 'react';
import './NumbersRound.css';

import useSound from 'use-sound';
import countdownTheme from '../../media/countdown.mp3';

import { getCurrentRoundDescription, getCurrentRound, getP1TotalScore, getP2TotalScore } from '../../game/selectors';
import { CountdownGame, NumbersRound } from '../../game/game';
import { CountdownAction, endRound, setNumbersRoundResult } from '../../game/actions';
import Selection from '../Selection/Selection';
import useNumbersDeclarations from '../../hooks/useNumbersDeclaration';
import useNumbersSelection from '../../hooks/useNumbersSelection';
import useNumbersSolution from '../../hooks/useNumbersSolution';
import useTimer from '../../hooks/useTimer';
import Timer from '../Timer/Timer';
import useEventListener from '../../hooks/useEventListener';

export interface NumbersRoundProps {
    game: CountdownGame;
    dispatch: (_: CountdownAction) => void;
}

const NumbersRoundComponent: React.FC<NumbersRoundProps> = ({game, dispatch}) => {

    const roundDescription = getCurrentRoundDescription(game);
    const selection = (getCurrentRound(game) as NumbersRound).selection;
    const target = (getCurrentRound(game) as NumbersRound).target;
    const [declarationsSubmitted, setDeclarationsSubmitted] = useState(false);

    const {startTimer, timeRemaining, isRunning, isExpired} = useTimer(30);
    const [startSound] = useSound(countdownTheme);

    const {selectionHasBeenMade, setSelectedLarges} = useNumbersSelection(dispatch);

    const max = useNumbersSolution(selection, target);
    const { declaration: p1Declaration, setDeclaration: setP1Declaration, valid: p1Valid, setValid: setP1Valid, score: p1Score } = useNumbersDeclarations(target);
    const { declaration: p2Declaration, setDeclaration: setP2Declaration, valid: p2Valid, setValid: setP2Valid, score: p2Score } = useNumbersDeclarations(target);
    const submitText = declarationsSubmitted ? 'Resubmit' : 'Submit';
    const submitDeclarations = () => {
        dispatch(setNumbersRoundResult(p1Declaration, p2Declaration, p1Score, p2Score, max));
        setDeclarationsSubmitted(true);
    };

    const startRound = () => {
        startTimer();
        startSound();
    };

    const makeSelection = (larges: number) => {
        if (!selectionHasBeenMade && !target) {
            setSelectedLarges(larges);
        }
    }

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.repeat) return;
        if (e.keyCode === 54) makeSelection(0);
        if (e.keyCode >= 48 && e.keyCode <= 52) makeSelection(e.keyCode - 48);
        if (e.keyCode === 32) {
            if (!isRunning && !isExpired && !!target) startRound();
            else if (declarationsSubmitted) dispatch(endRound());
        }
        if (e.keyCode === 13) {
            if (isExpired) submitDeclarations();
        }
    }

    useEventListener('keydown', handleKeydown);

    return (
        <div className="numbers-round">
            <div className="game__score">{game.p1Name} {getP1TotalScore(game)} - {getP2TotalScore(game)} {game.p2Name}</div>
            <div className="game__round-description">Numbers picked by {roundDescription.picker}</div>
            <div className="numbers-round__target">{target || '...'}</div>
            <div className="game__selection">
                <Selection selection={extendSelection(selection)}></Selection>
            </div>
            {!selectionHasBeenMade && !target && <div className="numbers-round__pick-actions">
                <button className="button--grey" onClick={() => makeSelection(0)}>6 small</button>
                <button className="button--grey" onClick={() => makeSelection(1)}>1 large</button>
                <button className="button--grey" onClick={() => makeSelection(2)}>2 large</button>
                <button className="button--grey" onClick={() => makeSelection(3)}>3 large</button>
                <button className="button--grey" onClick={() => makeSelection(4)}>4 large</button>
            </div>}
            {!!target && <div className="numbers-round__timer">
                <Timer durationSeconds={30} secondsRemaining={timeRemaining}></Timer>
                {!isRunning && !isExpired && <button className="button--green" onClick={startRound}>Start the clock</button>}
            </div>}
            {isExpired && <div className="numbers-round__declarations">
                <div className="numbers-round__inputs">
                    <div className="numbers-round__declaration">
                        <div className="numbers-round__name">{game.p1Name}</div>
                        <input tabIndex={1} type="number" value={p1Declaration || undefined} onChange={e => setP1Declaration(+e.target.value)}></input>
                        <div className="numbers-round__validity">
                            Valid?
                            <input tabIndex={3} type="checkbox" checked={p1Valid} onChange={e => setP1Valid(e.target.checked)}></input>
                        </div>
                    </div>
                    <div className="numbers-round__declaration">
                        <div className="numbers-round__name">{game.p2Name}</div>
                        <input tabIndex={2} type="number" value={p2Declaration || undefined} onChange={e => setP2Declaration(+e.target.value)}></input>
                        <div className="numbers-round__validity">
                            Valid?
                            <input tabIndex={4} type="checkbox" checked={p2Valid} onChange={e => setP2Valid(e.target.checked)}></input>
                        </div>
                    </div>
                </div>
                <button className="numbers-round__submit button--green" onClick={() => submitDeclarations()}>{submitText}</button>
            </div>}
            {declarationsSubmitted && <div className="numbers-round__results-preview">
                <div className="numbers-round__maxes">Best was: {max.value} = {max.method}</div>
                <button className="numbers-round__end button--blue" onClick={() => dispatch(endRound())}>End round</button>
            </div>}
        </div>
    );
};

export default NumbersRoundComponent;

const extendSelection = (selection: number[]): string[] => {
    const extended = [];
    for (let i = 0; i < 6 - selection.length; ++i) {
        extended.push('');
    }
    return [...extended, ...selection.map(n => n.toString())];
}
