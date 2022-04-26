import type { PolygonCenterGroup } from '../PolygonCenterGroup';

export enum EPolygonCenterGroupChangeEvent {
    POLYGON_ADD = 'POLYGON_ADD',
    POLYGON_MOVE = 'POLYGON_MOVE',
    POLYGON_REMOVE = 'POLYGON_REMOVE',

    VERTEX_ADD = 'VERTEX_ADD',
    VERTEX_MOVE = 'VERTEX_MOVE',
    VERTEX_REMOVE = 'VERTEX_REMOVE',

    CENTER_MOVE = 'CENTER_MOVE',

    PAYLOAD_CHANGE = 'POLYGON_PAYLOAD_CHANGE',
}

type PolygonCenterGroupChangeListener = (eventType: EPolygonCenterGroupChangeEvent, target: PolygonCenterGroup) => void;

class PolygonCenterGroupChangeObserver {
    private static listeners: Array<PolygonCenterGroupChangeListener> = [];

    public static subscribe(listener: PolygonCenterGroupChangeListener) {
        this.listeners.push(listener);
    }

    public static unsubscribe(listener: PolygonCenterGroupChangeListener) {
        const listenerIndex = this.listeners.indexOf(listener);

        this.listeners.splice(listenerIndex, 1);
    }

    // polygon
    public static polygonAddEventTrigger(target: PolygonCenterGroup) {
        this.dealEvent(EPolygonCenterGroupChangeEvent.POLYGON_ADD, target);
    }

    public static polygonMoveEventTrigger(target: PolygonCenterGroup) {
        this.dealEvent(EPolygonCenterGroupChangeEvent.POLYGON_MOVE, target);
    }

    public static polygonRemoveEventTrigger(target: PolygonCenterGroup) {
        this.dealEvent(EPolygonCenterGroupChangeEvent.POLYGON_REMOVE, target);
    }
    // vertex
    public static vertexAddEventTrigger(target: PolygonCenterGroup) {
        this.dealEvent(EPolygonCenterGroupChangeEvent.VERTEX_ADD, target);
    }

    public static vertexMoveEventTrigger(target: PolygonCenterGroup) {
        this.dealEvent(EPolygonCenterGroupChangeEvent.VERTEX_MOVE, target);
    }

    public static vertexRemoveEventTrigger(target: PolygonCenterGroup) {
        this.dealEvent(EPolygonCenterGroupChangeEvent.VERTEX_REMOVE, target);
    }

    // center
    public static centerMoveEventTrigger(target: PolygonCenterGroup) {
        this.dealEvent(EPolygonCenterGroupChangeEvent.CENTER_MOVE, target);
    }

    // payload
    public static payloadChangeTrigger(target: PolygonCenterGroup) {
        this.dealEvent(EPolygonCenterGroupChangeEvent.PAYLOAD_CHANGE, target);
    }

    private static dealEvent(eventType: EPolygonCenterGroupChangeEvent, target: PolygonCenterGroup) {
        this.listeners.forEach(handler => handler(eventType, target));
    }
}

export { PolygonCenterGroupChangeObserver };
