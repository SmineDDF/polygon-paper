import paper from 'paper';

import { PolygonCenterGroup } from '../PolygonCenterGroup';

class Polygon extends paper.Path {
    constructor(points: Array<paper.Point>, color: paper.Color) {
        super(points);

        this.fillColor = color;
        this.strokeColor = color;
        this.closed = true;
    }

    public getParentCenterGroup(): PolygonCenterGroup {
        if (!(this.parent instanceof PolygonCenterGroup)) {
            // eslint-disable-next-line no-console
            console.warn('Expected Polygon to have parent of type PolygonCenterGroup');
        }

        return this.parent as PolygonCenterGroup;
    }

    public remove(): boolean {
        return this.getParentCenterGroup().remove();
    }

    public removeVertex(vertex: paper.Segment): boolean {
        return this.getParentCenterGroup().removeVertex(vertex);
    }

    public registerVertexDragEnd() {
        return this.getParentCenterGroup().registerVertexDragEnd();
    }
}

export { Polygon };
