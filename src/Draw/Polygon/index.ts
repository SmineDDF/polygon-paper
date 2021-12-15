import paper from 'paper';
import { PolygonCenterGroup } from '../PolygonCenterGroup';

class Polygon extends paper.Path {
    constructor(...args: ConstructorParameters<typeof paper.Path>) {
        super(...args);
        
        this.closed = true;
    }

    public removeWithGroup() {
        if (this.parent instanceof PolygonCenterGroup) {
            this.parent.remove();
        }
    }
};

export { Polygon };