# Marking images up with polygon shapes
npm: [polygon-paper](https://www.npmjs.com/package/polygon-paper)

Made with [paper.js](https://github.com/paperjs/paper.js)

[Readme на русском](./readme-ru.md)

## What is it:
It's a tool to draw polygons on an image and save them as coordinate arrays (vertexes + center point).

## What it could be used for:
If you need to highlight a part of an image when a user hovers over it, first you need to know where is this hoverable zone located. Someone somewhere needs to draw the hoverable zone shape and send this data over to the website. And that is a use case for this library.

## How it looks like
![img](./readme-example.png)

_Color selection is pseudo-random [src/utils/polygonColorGenerator.ts](./src/utils/polygonColorGenerator.ts)_

## Installation nad usage
1. Install the library from npm: `npm install polygon-paper`
2. Create a `canvas` element with set width and height: `<canvas width="1000" height="1000" id="mycanvas" />` _`canvas` will shrink one of its sides to fit the aspect ratio of the loaded image_
3. Import the library: `import { Draw } from 'polygon-paper'`
4. Create an instance of `Draw` class and initialize it using previuosly created `canvas` DOM node and image url:
```js
const draw = new Draw();
const canvasElement = document.getElementById("mycanvas");
const imageUrl = "https://resource.com/image-to-draw-on.png";

draw.init(canvasElement, imageUrl);
```
Constructor `new Draw(config?: IDrawConfig)` also accepts an optional config object.

`draw.init(canvasElement: HTMLCanvasElement, imageUrl: string, initialPolygons?: IPolygonWithCenter[])` accepts an optional array of initial polygons as its third argument. That could be used to load and edit already created polygons.

More details on that in *API* section.

5. Set up a callback function to track changes to the polygons:
```js
const myCallback = (newPolygonArray) => { doSomethingWithPolygons(newPolygonArray); }

draw.setOnChangeListener(myCallback);
```
Callback is called every time a polygon is created / moved / deleted, or when a polygon's vertex is created / moved / deleted or when the central point of a polygon is moved. The callback is also called when a polygon's payload is changed with `draw.setPolygonPayloadByIndex`.

1. It is advised to call `draw.destroy()` when the library is not used anymore.

## API
### Types
#### Polygon format
```ts
interface IPoint {
    x: number;
    y: number;
}
```

**Important: the coordinates are relative to the canvas dimensions**.

For example, a vertex with absolute coordinates of `{ x: 200, y: 300 }`, that is generated on a canvas of size `1000x500` will have relative coordinates of `{ x: 0.2, y: 0.6 }`. So that the absolute `x` coordinate will be divided by image's `width` and the absolute `y` is divided by image's `height`.

This approach allows us to prevent possible issues with images changing their resolution.

```ts
interface IPolygonWithCenter {
    points: IPoint[];
    center: IPoint;
    payload?: Record<string, any>;
    color?: string;
}
```
_the format of a polygon that is passed to on change callback_

#### Constructor config `new Draw(config: IDrawConfig)`:
```ts
interface IDrawConfig {
    // the distance of click registering
    // e.g., when you want to drag a vertex, this distance will add a
    // "padding" to the vertex, so that when you don't hit the exact coordinate of it,
    // the click will still be registered as "start dragging" instead of
    // "start creating new polygon near the vertex
    pointerEventsTolerance: number;

    // polygon body opacity, value: from 0 to 1
    polygonTransparency: number;

    // polygon center radius
    // it is ignored if polygon has a label set with centerPointLabelFormatter
    draggableCenterCircleRadius: number;

    // magnification factor when scrolling to zoom
    // value of 0.1 would mean that every time a zoom happens, the image will be
    // scaled by 10%
    zoomFactor: number;

    // formatter that builds a label to be displayed as a center of polygon instead of a circle
    // builds the label from payload assigned to a polygon
    centerPointLabelFormatter: (polygonCenterGroupPayload: Record<string, unknown>) => string | null;

    centerPointLabelFontSize: number;

    centerPointsHidden: boolean;

    // if set to true, calls window.confirm before deleting a polygon
    shouldConfirmPolygonDeletion: boolean;

    // text to be displayed in delete confirmation window.confirm modal
    labelDeletePolygonConfirm: string;

    // text to be displayed on context menu button "delete polygon"
    labelDeletePolygon: string;

    // text to be displayed on context menu button "delete polygon vertex"
    labelDeleteVertex: string;
}
```

### Controls 
#### Creating polygon 
Click on an empty space on canvas to pin the first vertex. Continue pinning vertexes until you are done, then connect the last vertex to the first one.

#### Editing polygon
- Drag'n'drop polygon by it's body
- Drag'n'drop vertexes
- Drag'n'drop polygon centers
- Add a new vertex by dragging an edge or by right-clicking an edge and choosing "add vertex" in context menu
- Delete a vertex by left-clicking it while holding `shift`, or by right-clicking it and choosing "delete vertex" in context menu

#### Deleting polygon
- Select a polygon by clicking it's body and press `delete`
- Right-click polygon body and select "delete polygon" in context menu
- Delete a polygon programmatically by invoking `deletePolygonByIndex`

### Draw instance public methods
#### init
```ts
draw.init(canvas: HTMLCanvasElement, imgUrl: string, initialPolygons: IPolygonWithCenter[]): void
```
Load an image, resize canvas to fit this image and set up internal event handlers and set up internal event handlers.

#### destroy
```ts
draw.destroy(): void
```
Remove part of internal handlers that are altering canvas's behavior, remove polygon change callback set via `setOnChangeListener`.

#### setOnChangeListener
```ts
draw.setOnChangeListener(null | (newPolygons: IPolygonWithCenter[]) => void): void
```
Add a callback to be called when a polygon is added / changed / deleted.

#### highlightPolygonByIndex
```ts
draw.highlightPolygonByIndex(index: number): void
```
Highlight a polygon with a semi-transparent white overlay above it. Unhighlights previously highlighted polygons.

#### unhighlightPolygons
```ts
draw.unhighlightPolygons(): void
```
Unhighlight all highlighted polygons.

#### deletePolygonByIndex
```ts
draw.deletePolygonByIndex(index: number): void
```
Delete polygon by index. Indexes are consistent with the indexes of array returned by `setOnChangeListener` callback.

#### setPolygonPayloadByIndex
```ts
draw.setPolygonPayloadByIndex(index: number, payload: null | Record<string, unknown>): void
```
Assign a `payload` to a polygon. Fires `setOnChangeListener` callback.
Payload should be an object.

#### setConfigField
```ts
draw.setConfigField<T extends keyof IDrawConfig>(field: T, fieldValue: IDrawConfig[T]);
```
Change one of config fields and rerender polygons with new config.

#### setConfig
```ts
draw.setConfig(field: Partial<IDrawConfig>);
```
Change the config and rerender polygons with the new one.

# Limitations 
1. Minified bundle size is `368 KB`, which is not good. Consider using it only in internal interfaces where loading speed is not critical.
2. It is not intended for mobile devices. Mouse event handlers used in this library aren't fired on touch events. It might be fixed by replacing them with touch-including events and adding a few new handlers.
3. I expect the library to malfunction if there are multiple instances of it on a page. Haven't checked that yet.

