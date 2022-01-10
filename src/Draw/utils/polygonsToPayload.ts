import paper from 'paper';

import { PolygonCenterGroup } from '../PolygonCenterGroup';

import { IPrimitivePoint, IPrimitivePolygonWithCenter } from '../types';

const pointToPrimitivePoint = (point: paper.Point): IPrimitivePoint => {
    return { x: point.x, y: point.y };
}

const polygonGroupToPrimitivePolygon = (group: PolygonCenterGroup): IPrimitivePolygonWithCenter => {
    const polygon = group.polygon.segments.map(s => pointToPrimitivePoint(s.point));
    const center = pointToPrimitivePoint(group.draggableCenter.bounds.center);
    const color = group.polygon.fillColor!.toString();

    return { 
        polygon,
        center,
        meta: {
            color
        }
    };
}

export const polygonsToPayload = (
    paperPolygonCenterGroups: PolygonCenterGroup[],
): IPrimitivePolygonWithCenter[] => {
    return paperPolygonCenterGroups.map(polygonGroupToPrimitivePolygon);
}