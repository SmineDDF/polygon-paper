import type { PolygonCenterGroup } from './PolygonCenterGroup';

export interface IDrawConfig {
    // distance of actuation for mouse events:
    // dragging, clicking, moving, magnetizing
    pointerEventsTolerance: number;

    // scales from 0 to 1
    polygonTransparency: number;

    // radius of circle that denotes center of polygon
    draggableCenterCircleRadius: number;

    // factor that means how much will view grow when zoomed
    // e.g. setting it to 0.1 means that every time user zooms in,
    // view will grow by 10%
    zoomFactor: number;

    // formatter to be used to create a label that will be displayed
    // inside the center point of a polygon
    // what you can do with it:
    // -- display some arbitrary value from polygon payload
    //    by returning polygonCenterGroup.getPayload()?.valueIWantToDisplay
    //
    // the label is updated each time polygon changes its payload (via Draw.setPolygonPayloadByIndex)
    centerPointLabelFormatter: (polygonCenterGroupPayload: PolygonCenterGroup['payload']) => string | null;

    // font size of text label formatted by the centerPointLabelFormatter function
    centerPointLabelFontSize: number;

    // if true, center points will be hidden but will keep their coordinates
    centerPointsHidden: boolean;

    // if set to true, will fire window.confirm with
    // text from "labelDeleteConfirm" config field
    // when polygon is deleted (via either delete button or context menu)
    shouldConfirmPolygonDeletion: boolean;

    // text to show in window.confirm popup when deleting a polygon
    labelDeletePolygonConfirm: string;

    // text to be displayed in context menu
    labelDeletePolygon: string;

    // text to be displayed in context menu
    labelDeleteVertex: string;
}

export type OnChangeEventHandler = (polygons: Array<IPolygonWithCenter>) => void;

export interface IPrimitivePoint {
    x: number;
    y: number;
}

export type PolygonPayload = Record<string, any>;

export interface IPolygonWithCenter {
    points: Array<IPrimitivePoint>;
    center: IPrimitivePoint;
    payload?: PolygonPayload;
    color?: string;
}
