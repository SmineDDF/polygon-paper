import paper from 'paper';

import { PolygonCenterGroup } from '../../PolygonCenterGroup';
import { Polygon } from '../../Polygon';
import { DraggableCenterPoint } from '../../DraggableCenterPoint';
import { HitTester } from '../../utils/hitTester';

import { IAttachedTool, Tool } from '../Tool';

class PolygonCenterGroupEditTool implements IAttachedTool {
    private didDrag: boolean;
    private currentlyDraggedSegment: paper.Segment | null;
    private currentlyDraggedPolygonGroup: PolygonCenterGroup | null;
    private currentlyDraggedCenterPoint: DraggableCenterPoint | null;
    private currentlyClickSelectedPolygonGroup: PolygonCenterGroup | null;

    private paperTool: Tool | null;

    constructor() {
        this.didDrag = false;
        this.currentlyDraggedSegment = null;
        this.currentlyDraggedPolygonGroup = null;
        this.currentlyDraggedCenterPoint = null;
        this.currentlyClickSelectedPolygonGroup = null;
        this.paperTool = null;
    }

    public activateTool() {
        if (! this.paperTool) {
            throw new Error('Trying to activate detached tool');
        }

        this.paperTool.on('mousedown', this.onMouseDownHandler);
        this.paperTool.on('mouseup', this.onMouseUpHandler);
        this.paperTool.on('mousemove', this.onMouseMoveHandler);
        this.paperTool.on('mousedrag', this.onMouseDragHandler);
        this.paperTool.on('keydown', this.onKeyDownHandler);
    }

    public deactivateTool() {
        if (! this.paperTool) {
            return;
        }

        this.paperTool.off('mousedown', this.onMouseDownHandler);
        this.paperTool.off('mouseup', this.onMouseUpHandler);
        this.paperTool.off('mousemove', this.onMouseMoveHandler);
        this.paperTool.off('mousedrag', this.onMouseDragHandler);
        this.paperTool.off('keydown', this.onKeyDownHandler);
    } 

    public attachTo(paperTool: Tool): void {
        this.paperTool = paperTool;
    }

    public detach(): void {
        this.paperTool = null;
    }

    private onMouseDownHandler = (event: paper.ToolEvent) => {
        // @ts-expect-error undeclared type for existing field
        const isClickingWithLeftMouseButton = event.event.button === 0;

        if (! isClickingWithLeftMouseButton) {
            event.stop();

            return;
        }

        this.didDrag = false;
        this.currentlyDraggedSegment = null;
        this.currentlyDraggedPolygonGroup = null;
        this.currentlyDraggedCenterPoint = null;

        const hitTester = new HitTester(event); 

        if (event.modifiers.shift && hitTester.polygonHitResult) {
            if (hitTester.polygonHitResult.type === 'segment') {
                (hitTester.polygonHitResult.item as Polygon).removeVertex(hitTester.polygonHitResult.segment);
            };

            return;
        }

        if (hitTester.polygonCenterHitResult) {
            this.currentlyDraggedCenterPoint = hitTester.polygonCenterHitResult.item as DraggableCenterPoint;

            return;
        }

        if (hitTester.polygonHitResult) {
            this.currentlyDraggedPolygonGroup = hitTester.polygonHitResult.item.parent as PolygonCenterGroup;
            this.clickSelect(hitTester.polygonHitResult.item.parent as PolygonCenterGroup);

            if (hitTester.polygonHitResult.type === 'segment') {
                this.currentlyDraggedSegment = hitTester.polygonHitResult.segment;
            } else if (hitTester.polygonHitResult.type === 'stroke') {
                const location = hitTester.polygonHitResult.location;
                this.currentlyDraggedSegment = (hitTester.polygonHitResult.item as Polygon).insert(location.index + 1, event.point);
                event.stop();
            }

            return;
        }

        this.clearClickSelection();
    }

    private onMouseUpHandler = () => {
        if (! this.didDrag) {
            return;
        }

        if (this.currentlyDraggedSegment) {
            (this.currentlyDraggedSegment.path as Polygon).registerVertexDragEnd();

            return;
        } 

        if (this.currentlyDraggedPolygonGroup) {
            this.currentlyDraggedPolygonGroup.registerPolygonDragEnd();

            return;
        } 

        if (this.currentlyDraggedCenterPoint) {
            this.currentlyDraggedCenterPoint.getCenterGroup().registerCenterDragEnd();
        }
    }

    private onMouseMoveHandler = (event: paper.ToolEvent) => {
        paper.project.activeLayer.selected = false;
        
        if (this.currentlyClickSelectedPolygonGroup) {
            this.currentlyClickSelectedPolygonGroup.polygon.selected = true;
        }

        if (event.item && event.item instanceof PolygonCenterGroup) {
            event.item.polygon.selected = true;
        }
    }

    private onMouseDragHandler = (event: paper.ToolEvent) => {
        this.didDrag = true;

        let whatToDrag;

        switch (true) {
            case Boolean(this.currentlyDraggedSegment): {
                whatToDrag = this.currentlyDraggedSegment!.point;
                break;
            }
            case Boolean(this.currentlyDraggedPolygonGroup): {
                whatToDrag = this.currentlyDraggedPolygonGroup!.position;
                break;
            }
            case Boolean(this.currentlyDraggedCenterPoint): {
                whatToDrag = this.currentlyDraggedCenterPoint!.position;
                break;
            }
            default: return;
        }

        whatToDrag.x += event.delta.x;
        whatToDrag.y += event.delta.y;
    } 

    private onKeyDownHandler = (event: paper.KeyEvent) => {
        if (this.currentlyClickSelectedPolygonGroup) {
            if (event.key === 'delete') { 
                this.currentlyClickSelectedPolygonGroup.remove()    
            } else if (event.key === 'escape') {
                this.clearClickSelection();
            }
        }
    }

    private clickSelect(item: PolygonCenterGroup) {
        this.currentlyClickSelectedPolygonGroup = item;
        this.currentlyClickSelectedPolygonGroup.polygon.selected = true;
    }

    private clearClickSelection() {
        if (this.currentlyClickSelectedPolygonGroup) {
            this.currentlyClickSelectedPolygonGroup.polygon.selected = false;
            this.currentlyClickSelectedPolygonGroup = null;
        }
    }
}

export { PolygonCenterGroupEditTool };