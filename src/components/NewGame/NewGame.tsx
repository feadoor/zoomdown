import React from 'react';
import './NewGame.css';

import { setPlayerNames, startGame, CountdownAction } from '../../game/actions';
import { CountdownGame } from '../../game/game';
import Selection from '../Selection/Selection';

export interface NewGameProps {
    game: CountdownGame;
    dispatch: (_: CountdownAction) => void;
}

const NewGame: React.FC<NewGameProps> = ({game, dispatch}) => {
    return (
        <div className="new-game">
            <div className="game__selection">
                <Selection selection={['C', 'O', 'U', 'N', 'T', 'D', 'O', 'W', 'N']}></Selection>
            </div>
            <div className="new-game__names">
                <div className="new-game__name">
                    <div className="new-game__label">Player 1 Name</div>
                    <input type="text" value={game.p1Name} onChange={e => dispatch(setPlayerNames(e.target.value, game.p2Name))}></input>
                </div>
                <div className="new-game__name">
                    <div className="new-game__label">Player 2 Name</div>
                    <input type="text" value={game.p2Name} onChange={e => dispatch(setPlayerNames(game.p1Name, e.target.value))}></input>
                </div>
            </div>
            <div className="new-game__buttons">
                <button className="button--blue" onClick={() => dispatch(startGame('9R'))}>Start 9-Rounder</button>
                <button className="button--blue" onClick={() => dispatch(startGame('15R'))}>Start 15-Rounder</button>
            </div>
        </div>
    );
};

export default NewGame;
