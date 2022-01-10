import paper from 'paper';

import { getRelevantMenuItemsDeclarations } from '../../../configs/contextMenuItemsDeclarations';

import { ContextMenuItem } from './ContextMenuItem';

class ContextMenu extends paper.Group {
    private menuItems: ContextMenuItem[];

    constructor() {
        super();
        this.visible = false;

        this.menuItems = []; 
    }

    public show = (point: paper.Point, hitResult: paper.HitResult) => {
        hitResult.item.selected = false;
        this.menuItems = this.getRelevantMenuItems(point, hitResult);
        this.renderMenu(this.menuItems);
        this.bounds.topLeft = point;
        this.bringToFront();
        this.layer.activate();
        this.visible = true;
    }

    public hide = () => {
        this.visible = false;
        this.destroyMenuItems();
    }

    private getRelevantMenuItems(point: paper.Point, hitResult: paper.HitResult): ContextMenuItem[] {
        return getRelevantMenuItemsDeclarations(hitResult)
            .map(decl => ContextMenuItem.fromDeclaration(decl, { hitResult, point }));
    }

    private renderMenu(items: ContextMenuItem[]) {
        this.addChildren(items);

        let offset = 0;
        let maxWidth = 0;

        items.forEach(item => {
            item.bounds.top = offset;

            offset += item.bounds.height;
            maxWidth = Math.max(maxWidth, item.backgroundBounds.width);

            item.on('click', this.hide);
        });

        items.forEach(item => item.backgroundBounds.width = maxWidth);
    }

    private destroyMenuItems() {
        this.menuItems.forEach(item => item.remove());
        this.menuItems = [];
    }
}

export { ContextMenu };