import React from 'react';
import './GameOver.css';

import { CountdownGame } from '../../game/game';
import { CountdownAction, createNewGame } from '../../game/actions';
import { getP1TotalScore, getP2TotalScore } from '../../game/selectors';
import Selection from '../Selection/Selection';
import Recap from '../Recap/Recap';

export interface GameOverProps {
    game: CountdownGame;
    dispatch: (_: CountdownAction) => void;
}

const GameOver: React.FC<GameOverProps> = ({game, dispatch}) => {
    return (
        <div className="game-over">
            <div className="game__selection">
                <Selection selection={['G', 'A', 'M', 'E', ' ', 'O', 'V', 'E', 'R']}></Selection>
            </div>
            <div className="game__score">{game.p1Name} {getP1TotalScore(game)} - {getP2TotalScore(game)} {game.p2Name}</div>
            <div className="game__recap">
                <Recap game={game}></Recap>
            </div>
            <button className="button--blue" onClick={() => dispatch(createNewGame())}>Start New Game</button>
        </div>
    );
};

export default GameOver;
