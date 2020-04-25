import React from 'react';
import './LettersRound.css';

import useSound from 'use-sound';
import countdownTheme from '../../media/countdown.mp3';

import { getCurrentRoundDescription, getCurrentRound } from '../../game/selectors';
import { CountdownGame, LettersRound } from '../../game/game';
import { CountdownAction, drawConsonant, drawVowel, setLettersRoundResult, endRound } from '../../game/actions';
import Selection from '../Selection/Selection';
import useLettersDeclarations from '../../hooks/useLettersDeclaration';
import useLettersSolution from '../../hooks/useLettersSolution';
import useTimer from '../../hooks/useTimer';
import Timer from '../Timer/Timer';

export interface LettersRoundProps {
    game: CountdownGame;
    dispatch: (_: CountdownAction) => void;
}

const LettersRoundComponent: React.FC<LettersRoundProps> = ({game, dispatch}) => {

    const roundDescription = getCurrentRoundDescription(game);
    const selection = (getCurrentRound(game) as LettersRound).selection;
    const declarationsSubmitted = (getCurrentRound(game) as LettersRound).p1Declaration !== undefined;

    const {startTimer, timeRemaining, isRunning, isExpired} = useTimer(30);
    const [startSound] = useSound(countdownTheme);

    const maxes = useLettersSolution(selection);
    const { declaration: p1Declaration, setDeclaration: setP1Declaration, score: p1Score } = useLettersDeclarations(selection);
    const { declaration: p2Declaration, setDeclaration: setP2Declaration, score: p2Score } = useLettersDeclarations(selection);
    const submitDeclarations = () => dispatch(setLettersRoundResult(p1Declaration, p2Declaration, p1Score, p2Score, maxes));

    return (
        <div className="letters-round">
            <div className="letters-round__title">Letters picked by {roundDescription.picker}</div>
            <div className="letters-round__selection">
                <Selection selection={extendSelection(selection)}></Selection>
            </div>
            {selection.length < 9 && <div className="letters-round__pick-actions">
                <button disabled={countConsonants(selection) >= 6} onClick={() => dispatch(drawConsonant())}>Consonant</button>
                <button disabled={countVowels(selection) >= 5} onClick={() => dispatch(drawVowel())}>Vowel</button>
            </div>}
            {selection.length === 9 && <div className="letters-round__timer">
                <Timer durationSeconds={30} secondsRemaining={timeRemaining}></Timer>
                {!isRunning && !isExpired && <button onClick={() => { startTimer(); startSound({}); }}>Start the clock</button>}
            </div>}
            {isExpired && <div className="letters-round__declarations">
                <input type="text" value={p1Declaration} onChange={e => setP1Declaration(e.target.value.toUpperCase())}></input>
                <input type="text" value={p2Declaration} onChange={e => setP2Declaration(e.target.value.toUpperCase())}></input>
                <button onClick={() => submitDeclarations()}>Submit declarations</button>
            </div>}
            {declarationsSubmitted && <div className="letters-round__results-preview">
                <span>{p1Score > 0 ? 'Valid' : 'Invalid'}</span>
                <span>{p2Score > 0 ? 'Valid' : 'Invalid'}</span>
                <div>Maxes were: {maxes.join(', ')}</div>
                <button onClick={() => dispatch(endRound())}>End round</button>
            </div>}
        </div>
    );
};

export default LettersRoundComponent;

const isVowel = (letter: string): boolean => letter === 'A' || letter === 'E' || letter === 'I' || letter === 'O' || letter === 'U';

const countConsonants = (selection: string[]) => selection.filter(c => !isVowel(c)).length;

const countVowels = (selection: string[]) => selection.filter(c => isVowel(c)).length;

const extendSelection = (selection: string[]): string[] => {
    const extended = [...selection];
    while (extended.length < 9) {
        extended.push('');
    }
    return extended;
}
