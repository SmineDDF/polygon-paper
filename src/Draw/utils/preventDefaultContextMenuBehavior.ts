const preventer = (e: Event) => e.preventDefault();

export const preventDefaultContextMenuBehavior = (element: HTMLElement) => {
    element.addEventListener('contextmenu', preventer);
}
