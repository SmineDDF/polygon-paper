export interface IDrawConfig {
    // distance of actuation for mouse events:
    // dragging, clicking, moving, magnetizing
    pointerEventsTolerance: number;

    // scales from 0 to 1
    polygonTransparency: number;

    // radius of circle that denotes center of polygon
    draggableCenterRadius: number;
}

export type OnChangeEventHandler = (polygons: IPrimitivePolygonWithCenter[]) => void;

export interface IPrimitivePoint {
    x: number;
    y: number;
}

export interface IPrimitivePolygonWithCenter {
    polygon: IPrimitivePoint[];
    center: IPrimitivePoint;
    meta: {
        color: string;
    }
}
