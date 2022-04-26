const preventer = (e: Event) => e.preventDefault();

export const preventDefaultContextMenuBehavior = (element: HTMLElement) => {
    element.addEventListener('contextmenu', preventer);
};

export const returnDefaultContextMenuBehavior = (element: HTMLElement) => {
    element.removeEventListener('contextmenu', preventer);
};
