import paper from 'paper';

import { Polygon } from '../Polygon';
import { DraggableCenterPoint } from '../DraggableCenterPoint';

class PolygonCenterGroup extends paper.Group {
    private polygonChild: Polygon;
    private draggableCenterChild: DraggableCenterPoint;

    constructor(polygon: Polygon, centerPoint: paper.Point) {
        super();

        const draggableCenter = DraggableCenterPoint.create(centerPoint || polygon.bounds.center);// new DraggableCenterPoint(centerPoint || polygon.bounds.center);

        this.polygonChild = polygon;
        this.draggableCenterChild = draggableCenter;

        this.addChild(polygon);
        this.addChild(draggableCenter);
    }

    public static fromPoints(polygonPoints: paper.Point[], centerPoint?: paper.Point): PolygonCenterGroup {
        const polygon = new Polygon(polygonPoints);

        return new PolygonCenterGroup(polygon, centerPoint || polygon.bounds.center);
    }

    public get polygon(): Polygon {
        return this.polygonChild;
    }

    public get draggableCenter(): DraggableCenterPoint {
        return this.draggableCenterChild;
    }

    public setColor(color: paper.Color) {
        this.polygonChild.fillColor = color;
        this.polygonChild.strokeColor = color;
        this.draggableCenterChild.fillColor = color;
    }
}

export { PolygonCenterGroup };
