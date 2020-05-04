import React, { useState } from 'react';
import './LettersRound.css';

import useSound from 'use-sound';
import countdownTheme from '../../media/countdown.mp3';

import { getCurrentRoundDescription, getCurrentRound, getP1TotalScore, getP2TotalScore } from '../../game/selectors';
import { CountdownGame, LettersRound } from '../../game/game';
import { CountdownAction, drawConsonant, drawVowel, setLettersRoundResult, endRound } from '../../game/actions';
import Selection from '../Selection/Selection';
import useLettersDeclarations from '../../hooks/useLettersDeclaration';
import useLettersSolution from '../../hooks/useLettersSolution';
import useTimer from '../../hooks/useTimer';
import Timer from '../Timer/Timer';
import useEventListener from '../../hooks/useEventListener';

export interface LettersRoundProps {
    game: CountdownGame;
    dispatch: (_: CountdownAction) => void;
}

const LettersRoundComponent: React.FC<LettersRoundProps> = ({game, dispatch}) => {

    const roundDescription = getCurrentRoundDescription(game);
    const selection = (getCurrentRound(game) as LettersRound).selection;
    const [declarationsSubmitted, setDeclarationsSubmitted] = useState(false);

    const {startTimer, timeRemaining, isRunning, isExpired} = useTimer(30);
    const [startSound] = useSound(countdownTheme);

    const maxes = useLettersSolution(selection);
    const { declaration: p1Declaration, setDeclaration: setP1Declaration, score: p1Score } = useLettersDeclarations(selection);
    const { declaration: p2Declaration, setDeclaration: setP2Declaration, score: p2Score } = useLettersDeclarations(selection);
    const submitText = declarationsSubmitted ? 'Resubmit' : 'Submit';
    const submitDeclarations = () => {
        dispatch(setLettersRoundResult(p1Declaration, p2Declaration, p1Score, p2Score, maxes));
        setDeclarationsSubmitted(true);
    };

    const pickConsonant = () => {
        if (selection.length < 9 && countConsonants(selection) < 6) {
            dispatch(drawConsonant());
        }
    };

    const pickVowel = () => {
        if (selection.length < 9 && countVowels(selection) < 5) {
            dispatch(drawVowel());
        }
    };

    const startRound = () => {
        startTimer();
        startSound();
    };

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.repeat) return;
        if (e.keyCode === 67) pickConsonant();
        if (e.keyCode === 86) pickVowel();
        if (e.keyCode === 32) {
            if (!isRunning && !isExpired && selection.length === 9) startRound();
            else if (isExpired && declarationsSubmitted) dispatch(endRound());
        }
        if (e.keyCode === 13) {
            if (isExpired) submitDeclarations();
        }
    }

    useEventListener('keydown', handleKeydown);

    return (
        <div className="letters-round">
            <div className="game__score">{game.p1Name} {getP1TotalScore(game)} - {getP2TotalScore(game)} {game.p2Name}</div>
            <div className="game__round-description">Letters picked by {roundDescription.picker}</div>
            <div className="game__selection">
                <Selection selection={extendSelection(selection)}></Selection>
            </div>
            {selection.length < 9 && <div className="letters-round__pick-actions">
                <button className="button--grey letters-round__pick" disabled={countConsonants(selection) >= 6} onClick={pickConsonant}>Consonant (C)</button>
                <button className="button--grey letters-round__pick" disabled={countVowels(selection) >= 5} onClick={pickVowel}>Vowel (V)</button>
            </div>}
            {!isExpired && selection.length === 9 && <div className="letters-round__timer game__full-width">
                <Timer durationSeconds={30} secondsRemaining={timeRemaining}></Timer>
                {!isRunning && !isExpired && <button className="button--green" onClick={startRound}>Start the clock</button>}
            </div>}
            {isExpired && <div className="letters-round__declarations game__full-width">
                <div className="letters-round__inputs">
                    <div className="letters-round__declaration">
                        <div className="letters-round__name">{game.p1Name}</div>
                        <input type="text" value={p1Declaration} onChange={e => setP1Declaration(e.target.value.toUpperCase())}></input>
                    </div>
                    <div className="letters-round__declaration">
                        <div className="letters-round__name">{game.p2Name}</div>
                        <input type="text" value={p2Declaration} onChange={e => setP2Declaration(e.target.value.toUpperCase())}></input>
                    </div>
                </div>
                <button className="letters-round__submit button--green" onClick={() => submitDeclarations()}>{submitText}</button>
            </div>}
            {isExpired && declarationsSubmitted && <div className="letters-round__results-preview">
                <div className="letters-round__validity game__full-width">
                    <span>{p1Score > 0 ? 'Valid' : 'Invalid'}</span>
                    <span>{p2Score > 0 ? 'Valid' : 'Invalid'}</span>
                </div>
                <div className="letters-round__maxes">Best was: {maxes.join(', ')}</div>
                <button className="letters-round__end button--blue" onClick={() => dispatch(endRound())}>End round</button>
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
