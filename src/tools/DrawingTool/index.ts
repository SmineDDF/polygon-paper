import paper from 'paper';

import { areSamePoint } from '../../utils/areSamePoint';
import { HitTester } from '../../utils/hitTester';

import type { Tool, IAttachedTool } from '../Tool';

type DrawPolygon = (points: Array<paper.Point>) => void;

class DrawingTool implements IAttachedTool {
    private paperTool: Tool | null;

    private drawingPoints: Array<paper.Point>;
    private isDrawing: boolean;
    private drawnPath: paper.Path | null;
    private drawPolygon: DrawPolygon;

    constructor(drawPolygon: DrawPolygon) {
        this.paperTool = null;

        this.drawingPoints = [];
        this.isDrawing = false;
        this.drawnPath = null;
        this.drawPolygon = drawPolygon;
    }

    public activateTool(): void {
        if (!this.paperTool) {
            throw new Error('Trying to activate detached tool');
        }

        this.paperTool.on('mousedown', this.onMouseDownHandler);
        this.paperTool.on('mousemove', this.onMouseMoveHandler);
        this.paperTool.on('keydown', this.onKeyDownHandler);
    }

    public deactivateTool(): void {
        if (!this.paperTool) {
            return;
        }

        this.paperTool.off('mousedown', this.onMouseDownHandler);
        this.paperTool.off('mousemove', this.onMouseMoveHandler);
        this.paperTool.off('keydown', this.onKeyDownHandler);
    }

    public attachTo(paperTool: Tool): void {
        this.paperTool = paperTool;
    }

    public detach(): void {
        this.paperTool = null;
    }

    private onMouseDownHandler = (event: paper.ToolEvent) => {
        // @ts-expect-error incorrect type declaration
        const isClickingWithLeftMouseButton = event.event.button === 0;
        const isPressingAlt = event.modifiers.alt;

        if (!isClickingWithLeftMouseButton || isPressingAlt) {
            return;
        }

        if (this.isDrawing) {
            const isConnectingToStartingPoint = areSamePoint(this.drawingPoints[0]!, event.point, paper.settings.hitTolerance);

            if (isConnectingToStartingPoint) {
                return this.stopDrawing();
            }

            return this.addPoint(event.point);
        }

        const hitTester = new HitTester(event);

        if (hitTester.didHitPolygon || hitTester.didHitPolygonGroup || hitTester.didHitPolygonCenter) {
            return;
        }

        this.startDrawing(event.point);
    };

    private onMouseMoveHandler = (event: paper.ToolEvent) => {
        if (!this.drawnPath) {
            return;
        }

        const isHoveringFirstPathPoint = areSamePoint(event.point, this.drawnPath.firstSegment.point, paper.settings.hitTolerance);

        // magnetizing to first point
        if (isHoveringFirstPathPoint) {
            document.body.style.cursor = 'pointer';
            this.drawnPath.lastSegment.point = this.drawnPath.firstSegment.point;

            return;
        }

        document.body.style.cursor = 'default';

        // the last segment is moving with user's cursor
        // and is not pushed to "drawingPoints" array
        this.drawnPath.lastSegment.point = event.point;
    };

    private onKeyDownHandler = (event: paper.KeyEvent) => {
        if (!this.isDrawing) {
            return;
        }

        if (event.key === 'delete' || event.key === 'escape') {
            this.stopTool();
        }
    };

    private startDrawing(point: paper.Point) {
        this.paperTool!.deactivateAllToolsExcept(this);
        this.isDrawing = true;
        this.drawPoint(point);
    }

    private addPoint(point: paper.Point) {
        this.drawPoint(point);
    }

    private stopDrawing() {
        if (this.drawingPoints.length > 2) {
            this.drawPolygon(this.drawingPoints);
        }

        this.stopTool();
    }

    private drawPoint(point: paper.Point) {
        this.drawingPoints.push(point);

        if (!this.drawnPath) {
            this.drawnPath = new paper.Path({
                strokeColor: new paper.Color('#1a9ceb'),
                strokeCap: 'square',
                strokeWidth: 1,
            });
            this.drawnPath.fullySelected = true;
        } else {
            // the last segment is moving with user's cursor
            // and is not pushed to "drawingPoints" array
            this.drawnPath.removeSegment(this.drawnPath.length - 1);
        }

        const newSegment = new paper.Segment(point);

        // add two identical segments:
        // the first segment is "pinned"
        // and the second is moving with user's cursor
        // (check "onMouseMoveHandler" method)
        this.drawnPath.addSegments([ newSegment, newSegment ]);
    }

    private stopTool() {
        this.drawingPoints = [];
        this.isDrawing = false;
        this.drawnPath?.remove();
        this.drawnPath = null;
        document.body.style.cursor = 'default';
        this.paperTool!.activateAllAttachedTools();
    }
}

export { DrawingTool };
