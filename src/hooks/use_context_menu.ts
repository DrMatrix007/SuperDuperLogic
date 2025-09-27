import { useState, useEffect, useCallback } from "react";

export type ContextTarget<T = any> = T | null;

type ContextMenuState<T = any> = {
    visible: boolean;
    x: number;
    y: number;
    target: ContextTarget<T>;
};

export function useContextMenu<T = any>() {
    const [state, setState] = useState<ContextMenuState<T>>({
        visible: false,
        x: 0,
        y: 0,
        target: null,
    });

    const open = useCallback((event: MouseEvent | React.MouseEvent<Element, MouseEvent>, target: T) => {
        event.preventDefault();
        setState({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            target,
        });
    }, []);

    const close = useCallback(() => {
        setState((s) => ({ ...s, visible: false }));
    }, []);

    useEffect(() => {
        const handleClick = () => close();
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [close]);

    return { state, open, close };
}
