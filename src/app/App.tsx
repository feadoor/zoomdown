import React from 'react';
import './App.css';

import useCountdownGame from '../hooks/useCountdownGame';
import { getGameState } from '../game/selectors';

import NewGame from '../components/NewGame/NewGame';
import BetweenRounds from '../components/BetweenRounds/BetweenRounds';
import LettersRound from '../components/LettersRound/LettersRound';
import NumbersRound from '../components/NumbersRound/NumbersRound';
import ConundrumRound from '../components/ConundrumRound/ConundrumRound';
import GameOver from '../components/GameOver/GameOver';

function App() {

    const [game, dispatch] = useCountdownGame();
    const gameState = getGameState(game);

    return (
        <div className="app">
            {gameState === 'WAITING' && <NewGame game={game} dispatch={dispatch}></NewGame>}
            {gameState === 'BETWEEN' && <BetweenRounds game={game} dispatch={dispatch}></BetweenRounds>}
            {gameState === 'LETTERS' && <LettersRound game={game} dispatch={dispatch}></LettersRound>}
            {gameState === 'NUMBERS' && <NumbersRound game={game} dispatch={dispatch}></NumbersRound>}
            {gameState === 'CONUNDRUM' && <ConundrumRound game={game} dispatch={dispatch}></ConundrumRound>}
            {gameState === 'ENDED' && <GameOver game={game} dispatch={dispatch}></GameOver>}
        </div>
    );
}

export default App;
