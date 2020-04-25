import { useState, useRef, useEffect } from 'react';
import { CountdownAction, drawSmall, drawLarge, setTarget } from '../game/actions';

export default function useNumbersSelection(_dispatch: (_: CountdownAction) => void) {

    const [selectedLarges, _setSelectedLarges] = useState<number | undefined>(undefined);
    const selectionHasBeenMade = selectedLarges !== undefined;

    const dispatch = useRef(_dispatch);

    useEffect(() => {
        dispatch.current = _dispatch;
    }, [_dispatch]);

    const setSelectedLarges = (larges: number) => {
        _setSelectedLarges(larges);
        for (let i = 0; i < 6 - larges; ++i) {
            setTimeout(() => dispatch.current(drawSmall()), 750 * (i + 1));
        }
        for (let i = 6 - larges; i < 6; ++i) {
            setTimeout(() => dispatch.current(drawLarge()), 750 * (i + 1));
        }
        setTimeout(() => dispatch.current(setTarget()), 750 * 7);
    };

    return {selectionHasBeenMade, setSelectedLarges};
}
