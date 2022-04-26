import paper from 'paper';

import type { PolygonCenterGroup } from '../PolygonCenterGroup';

import type { IPrimitivePoint, IPolygonWithCenter } from '../types';

type ConversionType = 'absolute' | 'relative';
type PointConverter = (point: paper.Point) => IPrimitivePoint;

const DEFAULT_POLYGON_FILL = new paper.Color(1, 1, 1, 1);

function convertPaperPolygonToPrimitive(group: PolygonCenterGroup, pointConverter: PointConverter): IPolygonWithCenter {
    const points = group.polygon.segments.map(s => pointConverter(s.point));
    const center = pointConverter(group.draggableCenter.bounds.center);
    const color = group.polygon.fillColor?.toCSS(true) || DEFAULT_POLYGON_FILL.toCSS(true);
    const payload = group.getPayload() || undefined;

    return {
        points,
        center,
        color,
        payload,
    };
}

export function convertPaperPolygonsToPrimitive(
    paperPolygonCenterGroups: Array<PolygonCenterGroup>,
    conversionType: ConversionType,
): Array<IPolygonWithCenter> {
    if (conversionType === 'absolute') {
        const pointConverter: PointConverter = point => ({ x: point.x, y: point.y });

        return paperPolygonCenterGroups.map(polygonCenterGroup => convertPaperPolygonToPrimitive(polygonCenterGroup, pointConverter));
    }

    if (conversionType === 'relative') {
        const canvasWidth = paper.view.bounds.width * paper.view.zoom;
        const canvasHeight = paper.view.bounds.height * paper.view.zoom;

        const pointConverter: PointConverter = point => ({ x: point.x / canvasWidth, y: point.y / canvasHeight });

        return paperPolygonCenterGroups.map(polygonCenterGroup => convertPaperPolygonToPrimitive(polygonCenterGroup, pointConverter));
    }

    throw new Error('Invalid conversion type passed to function');
}
