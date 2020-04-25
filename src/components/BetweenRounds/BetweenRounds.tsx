import React from 'react';
import './BetweenRounds.css';
import { CountdownGame } from '../../game/game';
import { CountdownAction, startLettersRound, startNumbersRound, startConundrumRound } from '../../game/actions';
import { getP1TotalScore, getP2TotalScore, getNextRoundDescription, RoundDescription } from '../../game/selectors';

export interface BetweenRoundsProps {
    game: CountdownGame;
    dispatch: (_: CountdownAction) => void;
}

const BetweenRounds: React.FC<BetweenRoundsProps> = ({game, dispatch}) => {

    const nextRoundDescription = getNextRoundDescription(game);

    const startNextRound = () => {
        switch (nextRoundDescription.type) {
            case 'LETTERS': return dispatch(startLettersRound());
            case 'NUMBERS': return dispatch(startNumbersRound());
            case 'CONUNDRUM': return dispatch(startConundrumRound());
        }
    }

    return (
        <div className="between-rounds">
            <div className="between-rounds__score">{game.p1Name} {getP1TotalScore(game)} - {getP2TotalScore(game)} {game.p2Name}</div>
            <div className="between-rounds__next-round">The next round will be: {roundSummary(nextRoundDescription)}</div>
            <button onClick={() => startNextRound()}>Start next round</button>
        </div>
    )
}

const roundSummary = (description: RoundDescription) => {
    switch (description.type) {
        case 'LETTERS': return `Letters picked by ${description.picker}`;
        case 'NUMBERS': return `Numbers picked by ${description.picker}`;
        case 'CONUNDRUM': return `Conundrum`;
    }
}

export default BetweenRounds;
