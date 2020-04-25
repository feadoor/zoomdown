import React from 'react';
import './GameOver.css';

import { CountdownGame } from '../../game/game';
import { CountdownAction, createNewGame } from '../../game/actions';
import { getP1TotalScore, getP2TotalScore } from '../../game/selectors';

export interface GameOverProps {
    game: CountdownGame;
    dispatch: (_: CountdownAction) => void;
}

const GameOver: React.FC<GameOverProps> = ({game, dispatch}) => {
    return (
        <div className="game-over">
            <div className="game-over__results">{game.p1Name} {getP1TotalScore(game)} - {getP2TotalScore(game)} {game.p2Name}</div>
            <button onClick={() => dispatch(createNewGame())}>Start New Game</button>
        </div>
    );
};

export default GameOver;
