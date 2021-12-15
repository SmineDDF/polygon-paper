import paper from 'paper';

import { GlobalConfig } from '../utils/globalConfig';

class DraggableCenterPoint extends paper.Shape {
    constructor() {
        super();

        throw new Error(
            "DraggableCenterPoint constructor should not be used due " + 
            "to incorrect inheritance from Shape.Circle, use create method instead"
        );
    }

    static create(center: paper.Point) {
        const point = new paper.Shape.Circle({ 
            center,
            radius: GlobalConfig.get('draggableCenterRadius'),
            strokeColor: new paper.Color(1,1,1),
        });

        Object.setPrototypeOf(point, DraggableCenterPoint.prototype);

        point.onMouseEnter = this.onMouseEnterHandler;
        point.onMouseLeave = this.onMouseLeaveHandler;

        return point;
    }

    private static onMouseEnterHandler = () => { 
        document.body.style.cursor = "pointer";
    }

    private static onMouseLeaveHandler = () => {
        document.body.style.cursor = "default";
    }
};

export { DraggableCenterPoint };
