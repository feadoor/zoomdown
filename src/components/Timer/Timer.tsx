import React from 'react';
import './Timer.css';

export interface TimerProps {
    durationSeconds: number;
    secondsRemaining: number;
}

const Timer: React.FC<TimerProps> = ({ secondsRemaining, durationSeconds }) => {
    return (
        <div className="timer">
            <div className="timer__progress" style={progressBarStyle(secondsRemaining, durationSeconds)}></div>
        </div>
    );
};

const progressBarStyle = (remaining: number, duration: number) => ({
    width: `${100 * remaining / duration}%`
});

export default Timer;
