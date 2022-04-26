import paper from 'paper';

import type { IDrawConfig, IPolygonWithCenter, OnChangeEventHandler, PolygonPayload } from './types';
import { GlobalConfig } from './utils/globalConfig';
import { defaultConfig } from './configs/defaultConfig';
import { preventDefaultContextMenuBehavior, returnDefaultContextMenuBehavior } from './utils/preventDefaultContextMenuBehavior';
import { addZoomOnScroll, removeZoomOnScroll } from './utils/addZoomOnScroll';

import { Background } from './Background';
import { PolygonCenterGroup } from './PolygonCenterGroup';
import { PolygonCenterGroupChangeObserver } from './PolygonCenterGroupChangeObserver';

import { Tool } from './tools/Tool';
import { PolygonCenterGroupEditTool } from './tools/PolygonCenterGroupEditTool';
import { ContextMenuTool } from './tools/ContextMenuTool';
import { DrawingTool } from './tools/DrawingTool';

import { polygonColorGenerator } from './utils/polygonColorGenerator';
import { convertPaperPolygonsToPrimitive } from './utils/convertPaperPolygonsToPrimitive';

class Draw {
    private onChange: null | OnChangeEventHandler;
    private paperTool: Tool | null;
    private canvas: HTMLCanvasElement | null;
    private currentlyHighlightedPolygon: PolygonCenterGroup | null;

    constructor(config: Partial<IDrawConfig> = defaultConfig) {
        this.onChange = null;
        this.paperTool = null;
        this.canvas = null;
        this.currentlyHighlightedPolygon = null;

        GlobalConfig.setAll(config);
        paper.settings.hitTolerance = GlobalConfig.get('pointerEventsTolerance');
    }

    public async init(canvas: HTMLCanvasElement, image: string, initialPolygons?: Array<IPolygonWithCenter>) {
        this.canvas = canvas;
        paper.setup(canvas);
        preventDefaultContextMenuBehavior(canvas);
        addZoomOnScroll(canvas);
        await this.initBackgroundImage(image);
        this.initTools();

        if (initialPolygons && initialPolygons.length > 0) {
            this.drawPolygonsFromPrimitive(initialPolygons);
            // firing onChange event with initialPolygons
            this.handlePolygonChange();
        }

        this.initPolygonChangeObserver();
    }

    public destroy() {
        if (this.canvas) {
            returnDefaultContextMenuBehavior(this.canvas);
            removeZoomOnScroll(this.canvas);
            this.destroyPolygonChangeObserver();
        }
    }

    public setOnChangeListener(listener: OnChangeEventHandler | null) {
        this.onChange = listener;
    }

    public highlightPolygonByIndex(index: number) {
        const polygon = this.getPolygonByIndex(index);

        if (polygon) {
            this.unhighlightPolygons();

            polygon.highlight();
            this.currentlyHighlightedPolygon = polygon;
        }
    }

    public unhighlightPolygons() {
        this.currentlyHighlightedPolygon?.unhighlight();
    }

    public deletePolygonByIndex(index: number) {
        const polygon = this.getPolygonByIndex(index);

        if (polygon) {
            polygon.remove();
        }
    }

    public setPolygonPayloadByIndex(index: number, payload: PolygonPayload | null) {
        const polygon = this.getPolygonByIndex(index);

        if (polygon) {
            polygon.setPayload(payload);
        }
    }

    public setConfigField<T extends keyof IDrawConfig>(key: T, value: IDrawConfig[T]) {
        GlobalConfig.set(key, value);
        this.rerenderAllPolygons();
    }

    public setConfig(config: Partial<IDrawConfig>) {
        GlobalConfig.setAll(config);
        this.rerenderAllPolygons();
    }

    // private -----------------------------------------------------

    private getAllPolygonGroups(): Array<PolygonCenterGroup> {
        return paper.project.getItems({ 'class': PolygonCenterGroup }) as Array<PolygonCenterGroup>;
    }

    private rerenderAllPolygons() {
        this.getAllPolygonGroups().forEach(originalPolygon => {
            originalPolygon.createClone({ silent: true });
            originalPolygon.remove({ silent: true });
        });

        // firing change event manually since they were silenced
        // earlier to avoid multiple callback calls
        this.handlePolygonChange();
    }

    private getPolygonByIndex(index: number): PolygonCenterGroup | undefined {
        const allPolygons = this.getAllPolygonGroups();

        return allPolygons[index];
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
        });
    }

    private initTools() {
        this.paperTool = new Tool();

        const polygonEditTool = new PolygonCenterGroupEditTool();
        const contextMenuTool = new ContextMenuTool();
        const drawingTool = new DrawingTool(this.handleDrawPolygonByHand);

        this.paperTool.attachTool(polygonEditTool);
        this.paperTool.attachTool(contextMenuTool);
        this.paperTool.attachTool(drawingTool);

        this.paperTool.activateAllAttachedTools();
    }

    private drawPolygonsFromPrimitive(polygonsWithCenterCoordinates: Array<IPolygonWithCenter>) {
        const canvasWidth = paper.view.bounds.width;
        const canvasHeight = paper.view.bounds.height;

        polygonsWithCenterCoordinates.forEach(({ points, center, payload }) => {
            const vertexPoints = points.map(relativePoint => {
                const absoluteX = relativePoint.x * canvasWidth;
                const absoluteY = relativePoint.y * canvasHeight;

                return new paper.Point(absoluteX, absoluteY);
            });

            const color = polygonColorGenerator();

            const centerX = center.x * canvasWidth;
            const centerY = center.y * canvasHeight;
            const centerPoint = new paper.Point(centerX, centerY);

            this.drawPolygon(vertexPoints, color, centerPoint, payload);
        });
    }

    private initPolygonChangeObserver() {
        PolygonCenterGroupChangeObserver.subscribe(this.handlePolygonChange);
    }

    private destroyPolygonChangeObserver() {
        PolygonCenterGroupChangeObserver.unsubscribe(this.handlePolygonChange);
    }

    private handlePolygonChange = () => {
        if (!this.onChange) {
            return;
        }

        // need to update view before making "snapshot" of current polygons
        // because paper renders frames lazily
        // and changes may be lost before the next automatic update occurs
        paper.project.view.update();

        const rawPolygons = paper.project.getItems({ 'class': PolygonCenterGroup }) as Array<PolygonCenterGroup>;
        const changedPolygonsArray = convertPaperPolygonsToPrimitive(rawPolygons, 'relative');

        this.onChange(changedPolygonsArray);
    };

    private drawPolygon(points: Array<paper.Point>, color: paper.Color, centerPoint?: paper.Point, payload?: Record<string, any>) {
        // eslint-disable-next-line no-new
        new PolygonCenterGroup(points, color, centerPoint, payload);
    }

    private handleDrawPolygonByHand = (points: Array<paper.Point>) => {
        this.drawPolygon(points, polygonColorGenerator());
    };
}

export { Draw };
