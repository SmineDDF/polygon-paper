import paper from 'paper';

import { GlobalConfig } from './globalConfig';

function handleMouseWheelToZoom(event: WheelEvent) {
    const oldZoom = paper.view.zoom;
    const zoomFactor = GlobalConfig.get('zoomFactor');
    const defaultHitTolerance = GlobalConfig.get('pointerEventsTolerance');

    let newZoom = paper.view.zoom;
    const isScrollingUp = event.deltaY < 0;

    if (isScrollingUp) {
        newZoom = paper.view.zoom * (1 + zoomFactor);
    } else {
        newZoom = paper.view.zoom * (1 - zoomFactor);
    }

    if (newZoom <= 1) {
        paper.view.zoom = 1;
        // centering the view relative to the canvas
        paper.view.center = paper.view.projectToView(paper.view.center);

        paper.settings.hitTolerance = defaultHitTolerance;

        return;
    }

    const beta = oldZoom / newZoom;

    const mousePosition = new paper.Point(event.offsetX, event.offsetY);

    // viewToProject: gives the coordinates in the Project space from the Screen Coordinates
    const viewMousePosition = paper.view.viewToProject(mousePosition);

    const pc = viewMousePosition.subtract(paper.view.center);
    const offset = viewMousePosition.subtract(pc.multiply(beta)).subtract(paper.view.center);

    paper.view.zoom = newZoom;
    paper.view.center = paper.view.center.add(offset);
    paper.settings.hitTolerance = defaultHitTolerance / newZoom;

    const topLeftCanvas = paper.view.bounds.topLeft;
    const topLeftView = paper.view.projectToView(paper.view.bounds.topLeft);

    const bottomRightCanvas = paper.view.bounds.bottomRight;
    const bottomRightView = paper.view.projectToView(paper.view.bounds.bottomRight);

    const leftCanvas = topLeftCanvas.x;
    const leftView = topLeftView.x;
    const rightCanvas = bottomRightCanvas.x;
    const rightView = bottomRightView.x;
    let xCorrection = 0;

    if (leftCanvas < leftView) {
        xCorrection = leftCanvas;
    } else {
        const rightGap = rightCanvas - rightView;

        if (rightGap > 0) {
            xCorrection = rightGap;
        }
    }

    let yCorrection = 0;
    const topCanvas = topLeftCanvas.y;
    const topView = topLeftView.y;
    const bottomCanvas = bottomRightCanvas.y;
    const bottomView = bottomRightView.y;

    if (topCanvas < topView) {
        yCorrection = topCanvas;
    } else {
        const bottomGap = bottomCanvas - bottomView;

        if (bottomGap > 0) {
            yCorrection = bottomGap;
        }
    }

    if (xCorrection || yCorrection) {
        const correctionOffset = new paper.Point(xCorrection, yCorrection);

        paper.view.center = paper.view.center.subtract(correctionOffset);
    }

    event.preventDefault();
}

export function addZoomOnScroll(canvas: HTMLCanvasElement) {
    // @ts-expect-error incorrect types
    canvas.addEventListener('mousewheel', handleMouseWheelToZoom);
}

export function removeZoomOnScroll(canvas: HTMLCanvasElement) {
    // @ts-expect-error incorrect types
    canvas.removeEventListener('mousewheel', handleMouseWheelToZoom);
}
