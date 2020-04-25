import React from 'react';
import './NewGame.css';

import { setPlayerNames, startGame, CountdownAction } from '../../game/actions';
import { CountdownGame } from '../../game/game';

export interface NewGameProps {
    game: CountdownGame;
    dispatch: (_: CountdownAction) => void;
}

const NewGame: React.FC<NewGameProps> = ({game, dispatch}) => {
    return (
        <div className="new-game">
            <input type="text" value={game.p1Name} onChange={e => dispatch(setPlayerNames(e.target.value, game.p2Name))}></input>
            <input type="text" value={game.p2Name} onChange={e => dispatch(setPlayerNames(game.p1Name, e.target.value))}></input>
            <button onClick={() => dispatch(startGame('9R'))}>Start 9-Rounder</button>
            <button onClick={() => dispatch(startGame('15R'))}>Start 15-Rounder</button>
        </div>
    );
};

export default NewGame;
