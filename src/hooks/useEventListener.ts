import { useRef, useEffect } from "react";

export default function useEventListener<T extends Event>(eventName: string, handler: (event: T) => void) {

    const savedHandler = useRef(handler);
    useEffect(() => {
        savedHandler.current = handler
    }, [handler]);

    useEffect(() => {
        const eventListener = (event: Event) => savedHandler.current(event as T);
        window.addEventListener(eventName, eventListener);
        return () => window.removeEventListener(eventName, eventListener);
    }, [eventName]);
}
