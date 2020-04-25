import { useState } from 'react';

import useInterval from './useInterval';

export default function useTimer(seconds: number) {

    const [timeRemaining, setTimeRemaining] = useState(seconds);
    const [isRunning, setIsRunning] = useState(false);
    const [isExpired, setIsExpired] = useState(false);

    useInterval(() => {
        if (timeRemaining > 0) {
            setTimeRemaining(time => Math.max(0, time - 0.02));
        } else {
            setIsRunning(false);
            setIsExpired(true);
        }
    }, isRunning ? 20 : null);

    const startTimer = () => {
        setTimeRemaining(seconds);
        setIsRunning(true);
    };

    const resumeTimer = () => {
        setIsRunning(true);
    };

    const stopTimer = () => {
        setIsRunning(false);
    };

    const expireTimer = () => {
        setIsExpired(true);
    }

    return { startTimer, resumeTimer, stopTimer, expireTimer, timeRemaining, isRunning, isExpired };
}
