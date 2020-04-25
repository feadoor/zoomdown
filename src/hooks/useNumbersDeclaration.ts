import { useState } from 'react';

export default function useNumbersDeclarations(target: number) {

    const [declaration, _setDeclaration] = useState(0);
    const [valid, _setValid] = useState(true);
    const [score, setScore] = useState(0);

    const setDeclaration = (value: number) => {
        _setDeclaration(value);
        setScore(valid ? scoreForDeclaration(value, target) : 0);
    };

    const setValid = (value: boolean) => {
        _setValid(value);
        setScore(value ? scoreForDeclaration(declaration, target): 0);
    };

    return { declaration, setDeclaration, valid, setValid, score };
}

const scoreForDeclaration = (value: number, target: number): number => {
    if (value === target) return 10;
    if (value >= target - 5 && value <= target + 5) return 7;
    if (value >= target - 10 && value <= target + 10) return 5;
    return 0;
};
