import paper from 'paper';

import { GlobalConfig } from '../utils/globalConfig';
import { PolygonCenterGroup } from '../PolygonCenterGroup';

const WHITE = new paper.Color(1, 1, 1);
const TEXT_PADDING = 4;
const BACKGROUND_CORNER_RADIUS = new paper.Size(4, 4);

class DraggableCenterPoint extends paper.Group {
    private circlePoint: paper.Shape.Circle | null;

    private textLabel: paper.PointText | null;
    private textLabelBackground: paper.Shape | null;

    private color: paper.Color;

    constructor(center: paper.Point, color: paper.Color, text?: string | null) {
        super();

        this.circlePoint = null;
        this.textLabel = null;
        this.textLabelBackground = null;

        this.color = color;

        this.render(center, color, text || null);

        this.onMouseEnter = DraggableCenterPoint.onMouseEnterHandler;
        this.onMouseLeave = DraggableCenterPoint.onMouseLeaveHandler;

        if (GlobalConfig.get('centerPointsHidden')) {
            this.hide();
        }
    }

    public updateText(text: string | null) {
        const center = this.bounds.center;

        this.render(center, this.color, text);
    }

    public getParentCenterGroup(): PolygonCenterGroup {
        if (!(this.parent instanceof PolygonCenterGroup)) {
            // eslint-disable-next-line no-console
            console.warn('Expected PolygonCenterGroup to have parent of type PolygonCenterGroup');
        }

        return this.parent as PolygonCenterGroup;
    }

    public registerCenterDragEnd() {
        this.getParentCenterGroup().registerCenterDragEnd();
    }

    public hide() {
        this.visible = false;
    }

    public show() {
        this.visible = true;
    }

    private static onMouseEnterHandler = () => {
        document.body.style.cursor = 'pointer';
    };

    private static onMouseLeaveHandler = () => {
        document.body.style.cursor = 'default';
    };

    private render(center: paper.Point, color: paper.Color, text: string | null) {
        this.circlePoint?.remove();
        this.circlePoint = null;

        this.textLabel?.remove();
        this.textLabel = null;

        this.textLabelBackground?.remove();
        this.textLabelBackground = null;

        if (text) {
            const textLabel = this.createTextLabel(center, text);
            const textLabelBackground = this.createTextLabelBackground(center, textLabel, color);

            this.addChildren([ textLabelBackground, textLabel ]);
            this.addChild(textLabelBackground);
            this.addChild(textLabel);

            this.textLabel = textLabel;
            this.textLabelBackground = textLabelBackground;
        } else {
            const circlePoint = this.createCirclePoint(center, color);

            this.addChild(circlePoint);
            this.circlePoint = circlePoint;
        }
    }

    private createTextLabel(center: paper.Point, text: string): paper.PointText {
        const textItem = new paper.PointText({
            content: text,
            fillColor: WHITE,
            fontSize: GlobalConfig.get('centerPointLabelFontSize'),
        });

        textItem.bounds.center = center;

        return textItem;
    }

    private createTextLabelBackground(center: paper.Point, textLabel: paper.PointText, color: paper.Color): paper.Shape.Rectangle {
        const size = textLabel.bounds.size.add(TEXT_PADDING * 2);

        const rectangle = new paper.Rectangle({ center, size });

        const background = new paper.Shape.Rectangle(rectangle, BACKGROUND_CORNER_RADIUS);

        background.strokeColor = WHITE;
        background.fillColor = color;

        return background;
    }

    private createCirclePoint(center: paper.Point, color: paper.Color): paper.Shape.Circle {
        return new paper.Shape.Circle({
            center,
            radius: GlobalConfig.get('draggableCenterCircleRadius'),
            fillColor: color,
            strokeColor: WHITE,
        });
    }
}

export { DraggableCenterPoint };
