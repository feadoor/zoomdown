import { useState, useEffect } from 'react';
import { findNumbersMethods } from '../solvers/numbersSolver';

export default function useNumbersSolution(selection: number[], target: number) {

    const [max, setMax] = useState<{value: number, method: string}>({value: 0, method: ''});
    const addSolution = (value: number, method: string) => setMax({value, method});

    useEffect(() => {
        if (target !== undefined) {
            return findNumbersMethods(selection, target, addSolution);
        }
    }, [selection, target]);

    return max;
}
