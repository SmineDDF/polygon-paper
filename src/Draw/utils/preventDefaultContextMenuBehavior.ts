export const preventDefaultContextMenuBehavior = (element: HTMLElement) => {
    element.addEventListener('contextmenu', e => e.preventDefault())
}