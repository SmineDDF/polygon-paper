import type { IDrawConfig } from '../types';

export const defaultConfig: IDrawConfig = {
    pointerEventsTolerance: 10,

    polygonTransparency: 0.7,

    draggableCenterCircleRadius: 10,

    zoomFactor: 0.1,

    centerPointLabelFormatter: () => null,
    centerPointLabelFontSize: 13,
    centerPointsHidden: false,

    shouldConfirmPolygonDeletion: true,

    labelDeletePolygonConfirm: 'Вы точно хотите удалить полигон?',
    labelDeletePolygon: 'Удалить полигон',
    labelDeleteVertex: 'Удалить вершину',
};
