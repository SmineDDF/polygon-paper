import paper from 'paper';
import { HitTester } from '../../utils/hitTester';

import { Tool, IAttachedTool } from '../Tool';

import { ContextMenu } from './ContextMenu';

class ContextMenuTool implements IAttachedTool {
    private paperTool: Tool | null;
    private contextMenu: ContextMenu;

    constructor() {
        this.paperTool = null;
        this.contextMenu = new ContextMenu();    
    }

    public activateTool() {
        if (! this.paperTool) {
            throw new Error('Trying to activate detached tool');
        }

        this.paperTool.on('mouseup', this.onMouseUpHandler);
    }

    public deactivateTool() {
        if (! this.paperTool) {
            return;
        }

        this.paperTool.off('mouseup', this.onMouseUpHandler);
    }

    public attachTo(paperTool: Tool): void {
        this.paperTool = paperTool;
    }

    public detach(): void {
        this.paperTool = null;
    }

    private showContextMenu = (point: paper.Point, hitResult: paper.HitResult) => {
        this.contextMenu.show(point, hitResult);
        this.paperTool!.deactivateAllToolsExcept(this);
    }

    private hideContextMenu = () => {
        this.contextMenu.hide();
        this.paperTool!.activateAllAttachedTools();
    }

    private onMouseUpHandler = (event: paper.ToolEvent) => {
        if (event.item instanceof ContextMenu) {
            return;
        }
        
        this.hideContextMenu();
        
        // @ts-expect-error incorrect type declaration
        const isClickingWithRightMouseButton = event.event.button === 2;

        if (! isClickingWithRightMouseButton) {
            return;
        }

        const polygonHitResult = new HitTester(event).polygonHitResult;

        if (! polygonHitResult) {
            return;
        }

        this.showContextMenu(event.point, polygonHitResult);
    }
}

export { ContextMenuTool };