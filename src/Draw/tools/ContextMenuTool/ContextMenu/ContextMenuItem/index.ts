import paper from 'paper';

import { IContextMenuItemDeclaration } from '../../../../configs/contextMenuItemsDeclarations';

interface IContextMenuItemContent {
    text: string;
}

class ContextMenuItem extends paper.Group {
    public backgroundBounds: paper.Rectangle;

    private text: paper.PointText;
    private background: paper.Path;
    
    constructor(content: IContextMenuItemContent) {
        super({ applyMatrix: false }); // this places children relative to this group,
                                       // not to the whole canvas
        
        this.text = this.drawText(content.text);
        this.background = this.drawTextBackground(this.text);
        this.backgroundBounds = this.background.bounds;

        this.addChildren([ this.background, this.text ]);
        this.on('mouseenter', this.handleMouseEnter);
        this.on('mouseleave', this.handleMouseLeave);
    }

    public static fromDeclaration(
        decl: IContextMenuItemDeclaration,
        context: {
            hitResult: paper.HitResult,
            point: paper.Point
        }
    ): ContextMenuItem {
        const content = { text: decl.label };
        const contextMenuItem = new ContextMenuItem(content);

        contextMenuItem.on('click', decl.action.bind(null, context.hitResult, context.point))

        return contextMenuItem;
    }

    private drawText(text: string): paper.PointText {
        const textItem = new paper.PointText(new paper.Point(0, 0));
        textItem.fillColor = new paper.Color('#2e2e2e');
        textItem.fontSize = 12;
        textItem.content = text;

        return textItem;
    }

    private drawTextBackground(textItem: paper.PointText): paper.Path {
        const backgroundBounds = textItem.bounds.clone().expand(8);

        const background = new paper.Path.Rectangle(backgroundBounds);

        background.fillColor = new paper.Color('#fafafa');

        return background;
    }

    private handleMouseEnter = () => {
        document.body.style.cursor = "pointer";
        this.background.fillColor = new paper.Color('#aed7fc');
    }

    private handleMouseLeave = () => {
        document.body.style.cursor = "default";
        this.background.fillColor = new paper.Color('#fafafa');
    }
}

export { ContextMenuItem };