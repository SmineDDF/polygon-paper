import paper from 'paper';
import debounce from 'lodash/debounce';

import { IDrawConfig, IPrimitivePoint, IDrawProps, OutputPolygonFormat, OnChangeEventHandler } from './types';
import { GlobalConfig } from './utils/globalConfig'; 
import { defaultConfig } from './utils/defaultConfig';
import { preventDefaultContextMenuBehavior } from './utils/preventDefaultContextMenuBehavior';

import { Background } from './Background';
import { PolygonCenterGroup } from './PolygonCenterGroup';

import { Tool } from './tools/Tool';
import { PolygonCenterGroupEditTool } from './tools/PolygonCenterGroupEditTool';
import { ContextMenuTool } from './tools/ContextMenuTool';
import { DrawingTool } from './tools/DrawingTool';

import { polygonColorGenerator } from './utils/polygonColorGenerator';
import { polygonsToPayload } from './utils/polygonsToPayload';

class Draw {
    private paperTool: Tool | null;
    private onChange: OnChangeEventHandler | null;
    private onChangeOutputType: OutputPolygonFormat | null;

    constructor(config: IDrawConfig = defaultConfig, onChangeProps?: IDrawProps) {
        GlobalConfig.setAll(config);
        paper.settings.hitTolerance = GlobalConfig.get('pointerEventsTolerance');

        this.onChange = onChangeProps?.onChange || null;
        this.onChangeOutputType = onChangeProps?.outputPolygonFormat || null;
        this.paperTool = null;
    }

    public async init(canvas: HTMLCanvasElement, image: string) {
        paper.setup(canvas);
        preventDefaultContextMenuBehavior(canvas);

        await this.initBackgroundImage(image);
        this.initTools(); 
    }

    public drawPolygonsFromPrimitivePoints(primitivePointPolygons: IPrimitivePoint[][]) {
        primitivePointPolygons.forEach(polygonPoints => 
            this.drawPolygon(
                polygonPoints.map(pp => new paper.Point(pp)),
                polygonColorGenerator()
            )
        )
    }

    public drawPolygonsFromRelativePrimitivePoints(relativePrimitivePointPolygons: IPrimitivePoint[][]) { 
        const canvasWidth = paper.view.bounds.width;
        const canvasHeight = paper.view.bounds.height;

        relativePrimitivePointPolygons.forEach(polygonPoints => {
            const absPoints = polygonPoints.map(({ x, y }) => {
                const absX = canvasWidth * x;
                const absY = canvasHeight * y;

                return new paper.Point(absX, absY);
            });

            this.drawPolygon(absPoints, polygonColorGenerator());
        });
    }

    private initTools() {
        this.paperTool = new Tool();

        const polygonEditTool = new PolygonCenterGroupEditTool();
        const contextMenuTool = new ContextMenuTool();
        const drawingTool = new DrawingTool(this.handleDrawPolygon);

        this.paperTool.attachTool(polygonEditTool);
        this.paperTool.attachTool(contextMenuTool);
        this.paperTool.attachTool(drawingTool);

        this.paperTool.activateAllAttachedTools();
    }
    
    private initBackgroundImage(image: string) {
        return new Promise(resolve => {
            const img = new Image();
            img.src = image;
            img.onload = () => {
                const background = new Background(img);
                background.fitBounds(paper.view.bounds);
                paper.view.viewSize = background.bounds.size;
                background.bounds.center = paper.view.center;
                background.sendToBack();
                background.onMouseMove = () => false;

                resolve(true);
            };
        })
    }
    
    private drawPolygon(points: paper.Point[], color: paper.Color) {
        const polygonGroup = PolygonCenterGroup.fromPoints(points);
        polygonGroup.setColor(color);
        this.handleAnyPolygonChange();
    }

    private handleDrawPolygon = (points: paper.Point[]) => {
        this.drawPolygon(points, polygonColorGenerator());
    }

    private handleAnyPolygonChange = debounce(() => {
        if (this.onChange) {
            this.onChange(
                polygonsToPayload(
                    paper.project.getItems({ class: PolygonCenterGroup }) as PolygonCenterGroup[],
                    this.onChangeOutputType!
                )
            );
        }
    }, 200) 
}

export { Draw };