import React from 'react';
import './Selection.css';

import LetterCard from '../LetterCard/LetterCard';

export interface SelectionProps {
    selection: string[];
}

const Selection: React.FC<SelectionProps> = ({ selection }) => {
    return (
        <div className="selection">
            {selection.map((str, idx) =>
                <LetterCard key={idx} content={str}></LetterCard>
            )}
        </div>
    );
};

export default Selection;
