const eventOnce = (element: Element, event: string, fn: EventListenerOrEventListenerObject): void => {
    element.addEventListener(event, () => {
        element.removeEventListener(event, fn, false);
    }, false);
};

export default eventOnce;
