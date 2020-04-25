import React from 'react';
import './LetterCard.css';

export interface LetterCardProps {
    content: string;
}

const LetterCard: React.FC<LetterCardProps> = ({ content }) => {
    return (
        <div className={'letter-card ' + (content.length === 0 ? 'letter-card--empty' : '')}>
            <div style={squash(content)}>{content}</div>
        </div>
    );
};

const squash = (content: string) => ({
    transform: content.length <= 1 ? 'scaleX(1)' : content.length === 2 ? 'scaleX(0.8)' : 'scaleX(0.6)'
});

export default LetterCard;
