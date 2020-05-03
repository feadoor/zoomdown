import { useState } from 'react';

import { checkValidity } from '../solvers/lettersSolver';

export default function useLettersDeclarations(selection: string[], _declaration: string = '') {
    const [declaration, _setDeclaration] = useState(_declaration);
    const [score, setScore] = useState(0);

    const setDeclaration = (word: string) => {
        const isValid = isContainedInSelection(word, selection) && checkValidity(word);
        _setDeclaration(word);
        setScore(isValid ? (word.length === 9 ? 18 : word.length) : 0);
    };

    return { declaration, setDeclaration, score };
}

const isContainedInSelection = (word: string, selection: string[]): boolean => {
    const selectionCounts = letterCounts(selection);
    const declarationCounts = letterCounts([...word]);
    return Object.keys(declarationCounts).every(c => selectionCounts[c] && selectionCounts[c] >= declarationCounts[c]);
}

const letterCounts = (selection: string[]): {[s: string]: number} => {
    const counts: {[s: string]: number} = {};
    for (const letter of selection) counts[letter] = (counts[letter] || 0) + 1;
    return counts;
}
