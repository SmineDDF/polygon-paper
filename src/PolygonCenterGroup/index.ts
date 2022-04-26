import paper from 'paper';

import type { PolygonPayload } from '../types';
import { GlobalConfig } from '../utils/globalConfig';

import { Polygon } from '../Polygon';
import { DraggableCenterPoint } from '../DraggableCenterPoint';
import { PolygonCenterGroupChangeObserver } from '../PolygonCenterGroupChangeObserver';

interface IEventConfig {
    silent?: boolean;
}

class PolygonCenterGroup extends paper.Group {
    private polygonChild: Polygon;
    private draggableCenterChild: DraggableCenterPoint;
    private highlightOverlay: paper.Path | null;
    private payload: PolygonPayload | null;

    constructor(
        polygonPoints: Array<paper.Point>,
        color: paper.Color,
        centerPoint?: paper.Point,
        payload?: PolygonPayload,
        eventConfig: IEventConfig = {},
    ) {
        super();

        const polygon = new Polygon(polygonPoints, color);
        const centerPointTextFormatter = GlobalConfig.get('centerPointLabelFormatter');
        const centerPointText = centerPointTextFormatter(payload || null);
        const draggableCenter = new DraggableCenterPoint(centerPoint || polygon.bounds.center, color, centerPointText);

        this.polygonChild = polygon;
        this.draggableCenterChild = draggableCenter;
        this.highlightOverlay = null;
        this.payload = payload || null;

        this.addChild(polygon);
        this.addChild(draggableCenter);

        if (! eventConfig.silent) {
            PolygonCenterGroupChangeObserver.polygonAddEventTrigger(this);
        }
    }

    public createClone(eventConfig: IEventConfig = {}): PolygonCenterGroup {
        const points = this.polygonChild.segments.map(segment => segment.point);
        const color = this.polygonChild.fillColor as paper.Color;
        const centerPoint = this.draggableCenterChild.bounds.center;
        const payload = this.payload || undefined;

        return new PolygonCenterGroup(points, color, centerPoint, payload, eventConfig);
    }

    public get polygon(): Polygon {
        return this.polygonChild;
    }

    public get draggableCenter(): DraggableCenterPoint {
        return this.draggableCenterChild;
    }

    public getPayload(): PolygonPayload | null {
        return this.payload;
    }

    public setPayload(payload: PolygonPayload | null) {
        this.payload = payload;

        const centerPointTextFormatter = GlobalConfig.get('centerPointLabelFormatter');
        const centerPointText = payload ? centerPointTextFormatter(payload) : null;

        this.draggableCenter.updateText(centerPointText);

        PolygonCenterGroupChangeObserver.payloadChangeTrigger(this);
    }

    public remove(eventConfig: IEventConfig = {}): boolean {
        const removeResult = super.remove();

        this.unhighlight();

        if (!eventConfig.silent) {
            PolygonCenterGroupChangeObserver.polygonRemoveEventTrigger(this);
        }

        return removeResult;
    }

    public removeVertex(vertex: paper.Segment): boolean {
        const removeResult = vertex.remove();

        // delete polygon if it has only 1 vertex left
        if (this.polygon.segments.length < 2) {
            this.remove();

            return removeResult;
        }

        PolygonCenterGroupChangeObserver.vertexRemoveEventTrigger(this);

        return removeResult;
    }

    public highlight() {
        const white48 = new paper.Color(1, 1, 1, 0.48);
        const highlightOverlay = new paper.Path(this.polygonChild.segments);

        highlightOverlay.fillColor = white48;

        this.highlightOverlay = highlightOverlay;
    }

    public unhighlight() {
        this.highlightOverlay?.remove();
        this.highlightOverlay = null;
    }

    public registerVertexDragEnd() {
        PolygonCenterGroupChangeObserver.vertexMoveEventTrigger(this);
    }

    public registerCenterDragEnd() {
        PolygonCenterGroupChangeObserver.centerMoveEventTrigger(this);
    }

    public registerPolygonDragEnd() {
        PolygonCenterGroupChangeObserver.polygonMoveEventTrigger(this);
    }
}

export { PolygonCenterGroup };
