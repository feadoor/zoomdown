import React from 'react';
import './NumbersRound.css';

import useSound from 'use-sound';
import countdownTheme from '../../media/countdown.mp3';

import { getCurrentRoundDescription, getCurrentRound } from '../../game/selectors';
import { CountdownGame, NumbersRound } from '../../game/game';
import { CountdownAction, endRound, SetNumbersRoundResult } from '../../game/actions';
import Selection from '../Selection/Selection';
import useNumbersDeclarations from '../../hooks/useNumbersDeclaration';
import useNumbersSelection from '../../hooks/useNumbersSelection';
import useNumbersSolution from '../../hooks/useNumbersSolution';
import useTimer from '../../hooks/useTimer';
import Timer from '../Timer/Timer';

export interface NumbersRoundProps {
    game: CountdownGame;
    dispatch: (_: CountdownAction) => void;
}

const NumbersRoundComponent: React.FC<NumbersRoundProps> = ({game, dispatch}) => {

    const roundDescription = getCurrentRoundDescription(game);
    const selection = (getCurrentRound(game) as NumbersRound).selection;
    const target = (getCurrentRound(game) as NumbersRound).target;
    const declarationsSubmitted = (getCurrentRound(game) as NumbersRound).p1Declaration !== undefined;

    const {startTimer, timeRemaining, isRunning, isExpired} = useTimer(30);
    const [startSound] = useSound(countdownTheme);

    const {selectionHasBeenMade, setSelectedLarges} = useNumbersSelection(dispatch);

    const max = useNumbersSolution(selection, target);
    const { declaration: p1Declaration, setDeclaration: setP1Declaration, valid: p1Valid, setValid: setP1Valid, score: p1Score } = useNumbersDeclarations(target);
    const { declaration: p2Declaration, setDeclaration: setP2Declaration, valid: p2Valid, setValid: setP2Valid, score: p2Score } = useNumbersDeclarations(target);
    const submitDeclarations = () => dispatch(SetNumbersRoundResult(p1Declaration, p2Declaration, p1Score, p2Score, max));

    return (
        <div className="numbers-round">
            <div className="numbers-round__title">Numbers picked by {roundDescription.picker}</div>
            <div className="number-round___target">{target || ''}</div>
            <div className="numbers-round__selection">
                <Selection selection={extendSelection(selection)}></Selection>
            </div>
            {!selectionHasBeenMade && target === 0 && <div className="numbers-round__pick-actions">
                <button onClick={() => setSelectedLarges(0)}>6 small</button>
                <button onClick={() => setSelectedLarges(1)}>1 large</button>
                <button onClick={() => setSelectedLarges(2)}>2 large</button>
                <button onClick={() => setSelectedLarges(3)}>3 large</button>
                <button onClick={() => setSelectedLarges(4)}>4 large</button>
            </div>}
            {target !== 0 && <div className="numbers-round__timer">
                <Timer durationSeconds={30} secondsRemaining={timeRemaining}></Timer>
                {!isRunning && !isExpired && <button onClick={() => { startTimer(); startSound({}); }}>Start the clock</button>}
            </div>}
            {isExpired && <div className="numbers-round__declarations">
                <input type="number" value={p1Declaration} onChange={e => setP1Declaration(+e.target.value)}></input>
                <input type="checkbox" checked={p1Valid} onChange={e => setP1Valid(e.target.checked)}></input>
                <input type="number" value={p2Declaration} onChange={e => setP2Declaration(+e.target.value)}></input>
                <input type="checkbox" checked={p2Valid} onChange={e => setP2Valid(e.target.checked)}></input>
                <button onClick={() => submitDeclarations()}>Submit declarations</button>
            </div>}
            {declarationsSubmitted && <div className="numbers-round__results-preview">
                <div>Max was: {max.value} = {max.method}</div>
                <button onClick={() => dispatch(endRound())}>End round</button>
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
