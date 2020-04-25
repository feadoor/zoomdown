import React, { useState } from 'react';
import './ConundrumRound.css';

import { CountdownGame, ConundrumRound } from '../../game/game';
import { CountdownAction, solveConundrum, endRound } from '../../game/actions';
import { getCurrentRound } from '../../game/selectors';
import useConundrum from '../../hooks/useConundrum';
import Selection from '../Selection/Selection';
import Timer from '../Timer/Timer';

export interface ConundrumRoundProps {
    game: CountdownGame;
    dispatch: (_: CountdownAction) => void;
}

const ConundrumRoundComponent: React.FC<ConundrumRoundProps> = ({game, dispatch}) => {

    const round = getCurrentRound(game) as ConundrumRound;

    const [p1Declaration, setP1Declaration] = useState('');
    const [p2Declaration, setP2Declaration] = useState('');

    const { startRound, buzz, p1HasDeclared, declareForP1, p2HasDeclared, declareForP2, timeRemaining, isRunning, isExpired } = useConundrum(dispatch, round.answer);
    const declarationBeingMade = round.scramble !== undefined && !isRunning && !isExpired;

    return (
        <div className="conundrum-round">
            <div className="conundrum-round__title">Conundrum</div>
            <div className="conundrum-round__selection">
                <Selection selection={declarationBeingMade ? emptySelection() : getSelection(round)}></Selection>
            </div>
            <div className="conundrum-round__timer">
                <Timer durationSeconds={30} secondsRemaining={timeRemaining}></Timer>
            </div>
            {round.scramble === undefined && <div className="conundrum-round__pick-actions">
                <button onClick={startRound}>Reveal conundrum</button>
            </div>}
            {isRunning && (!p1HasDeclared || !p2HasDeclared) && <div className="conundrum-round__buzzer">
                <button onClick={() => buzz()}>Buzz!</button>
            </div>}
            {round.scramble !== undefined && !isRunning && !isExpired && <div className="conundrum-round__declarations">
                <input disabled={p1HasDeclared} type="text" value={p1Declaration} onChange={e => setP1Declaration(e.target.value.toUpperCase())}></input>
                <button disabled={p1HasDeclared} onClick={() => declareForP1(p1Declaration)}>Submit declaration for P1</button>
                <input disabled={p2HasDeclared} type="text" value={p2Declaration} onChange={e => setP2Declaration(e.target.value.toUpperCase())}></input>
                <button disabled={p2HasDeclared} onClick={() => declareForP2(p2Declaration)}>Submit declaration for P2</button>
            </div>}
            {isExpired && !round.solved && <div className="conundrum-round__solve-button">
                <button onClick={() => dispatch(solveConundrum())}>Reveal answer</button>
            </div>}
            {isExpired && round.solved && <div className="conundrum-round__results">
                {round.p1Score > 0 && <span>Solved by P1</span>}
                {round.p2Score > 0 && <span>Solved by P2</span>}
                {round.p1Score === 0 && round.p2Score === 0 && <span>No-one solved it</span>}
                <button onClick={() => dispatch(endRound())}>End round</button>
            </div>}
        </div>
    );
};

export default ConundrumRoundComponent;

const emptySelection = () => ['', '', '', '', '', '', '', '', ''];

const getSelection = (round: ConundrumRound) => {
    if (round.scramble === undefined) return emptySelection();
    else if (!round.solved) return [...round.scramble];
    else return [...round.answer];
};
