import { useState, useEffect, useRef } from 'react';
import useSound from 'use-sound';
import countdownTheme from '../media/countdown.mp3';
import conundrums from '../data/conundrums.json';
import { CountdownAction, revealConundrum, setP1ConundrumDeclaration, setP2ConundrumDeclaration } from '../game/actions';
import useTimer from './useTimer';

export default function useConundrum(_dispatch: (_: CountdownAction) => void, answer: string | undefined) {

    const dispatch = useRef(_dispatch);
    useEffect(() => {
        dispatch.current = _dispatch
    }, [_dispatch]);

    const {resumeTimer, stopTimer, expireTimer, timeRemaining, isRunning, isExpired} = useTimer(30);
    const [startSound, {pause: pauseSound}] = useSound(countdownTheme);

    const [buzzTime, setBuzzTime] = useState<number | undefined>(undefined);
    const [p1HasDeclared, setP1HasDeclared] = useState(false);
    const [p2HasDeclared, setP2HasDeclared] = useState(false);

    const startRound = () => {
        const [scramble, answer] = randomConundrum();
        dispatch.current(revealConundrum(scramble, answer));
        beginTicking();
    };

    const beginTicking = () => {
        setBuzzTime(undefined);
        startSound({});
        resumeTimer();
    };

    const buzz = () => {
        pauseSound();
        stopTimer();
        setBuzzTime(30 - timeRemaining);
    };

    const declareForP1 = (guess: string) => {
        setP1HasDeclared(true);
        dispatch.current(setP1ConundrumDeclaration(buzzTime as number, guess));
        if (guess !== answer && !p2HasDeclared) beginTicking();
        else expireTimer();
    }

    const declareForP2 = (guess: string) => {
        setP2HasDeclared(true);
        dispatch.current(setP2ConundrumDeclaration(buzzTime as number, guess));
        if (guess !== answer && !p1HasDeclared) beginTicking();
        else expireTimer();
    }

    return { startRound, buzz, p1HasDeclared, declareForP1, p2HasDeclared, declareForP2, timeRemaining, isRunning, isExpired };
}

const randomConundrum = (): [string, string] => {
    const answer = pickRandomConundrumAnswer();
    const shuffle = decentShuffle();
    const scrambleLetters = shuffle.map(i => answer[i]);
    return [scrambleLetters.join(''), answer];
};

const pickRandomConundrumAnswer = (): string => {
    const numberOfConundrums = conundrums.conundrums.length;
    return conundrums.conundrums[Math.floor(numberOfConundrums * Math.random())].answer;
};

const decentShuffle = (): number[] => {
    while (true) {
        const shuffle = singleShuffle();
        if (inversions(shuffle) >= 12) return shuffle;
    }
};

const inversions = (shuffle: number[]): number => {
    let inversions = 0;
    for (let i = 0; i < shuffle.length; ++i) {
        for (let j = 0; j < shuffle.length; ++j) {
            if (shuffle[i] > shuffle[j]) ++inversions;
        }
    }
    return inversions;
};

const singleShuffle = () => {
    const items = [...Array(9)].map((_, idx) => idx);
    for (let i = items.length - 1; i > 0; --i) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
};