import paper from 'paper';

import { PolygonCenterGroup } from '../PolygonCenterGroup';

class Polygon extends paper.Path {
    constructor(...args: ConstructorParameters<typeof paper.Path>) {
        super(...args);
        
        this.closed = true;
    }

    public getCenterGroup(): PolygonCenterGroup {
        if (! (this.parent instanceof PolygonCenterGroup)) {
            console.warn('Expected Polygon to have parent of type PolygonCenterGroup')
        }

        return this.parent as PolygonCenterGroup;
    }

    public remove(): boolean {
        return this.getCenterGroup().remove()
    }

    public removeVertex(vertex: paper.Segment): boolean {
        return this.getCenterGroup().removeVertex(vertex);
    }

    public registerVertexDragEnd() {
        return this.getCenterGroup().registerVertexDragEnd();
    }
};

export { Polygon };