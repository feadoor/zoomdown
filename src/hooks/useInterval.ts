import { useEffect, useRef } from 'react';

export default function useInterval(callback: () => void, delay: number | null) {

    const savedCallback = useRef<() => void>();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay !== null) {
            let id = setInterval(() => savedCallback.current && savedCallback.current(), delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
