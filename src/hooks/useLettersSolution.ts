import { useState, useEffect } from 'react';
import { findAllWordsFromSelection } from '../solvers/lettersSolver';

export default function useLettersSolution(selection: string[]) {

    const [validWords, setValidWords] = useState<string[]>([]);
    const [maxLength, setMaxLength] = useState(0);
    const maxes = validWords.filter(w => w.length === maxLength).filter((word, idx, arr) => arr.indexOf(word) === idx);

    const addWord = (word: string) => {
        setValidWords(words => [...words, word]);
        setMaxLength(ml => Math.max(ml, word.length));
    };

    useEffect(() => {
        return findAllWordsFromSelection(selection, addWord);
    }, [selection]);

    return maxes;
}
