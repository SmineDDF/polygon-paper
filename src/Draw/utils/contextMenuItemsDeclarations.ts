import { Polygon } from '../Polygon';

export interface IContextMenuItemDeclaration {
    name: string;
    label: string;
    activeHitTypes: paper.HitResult['type'][];
    action: (
        hitResult: paper.HitResult,
        point: paper.Point,
        clickEvent: paper.MouseEvent
    ) => void;
}

const contextMenuItemsDeclarations: IContextMenuItemDeclaration[] = [
    {
        name: 'deletePolygon',
        label: 'Удалить полигон',
        activeHitTypes: ['fill', 'stroke', 'segment'],
        action: (hitResult: paper.HitResult) => {
            if (hitResult.item instanceof Polygon) {
                hitResult.item.removeWithGroup();
            }
        }
    },
    {
        name: 'deleteSegment',
        label: 'Удалить вершину',
        activeHitTypes: ['segment'],
        action: (hitResult: paper.HitResult) => {
            if (hitResult.item instanceof Polygon && hitResult.item.segments.length === 2) {
                hitResult.item.removeWithGroup();
            }

            hitResult.segment.remove();
        }
    }
]

export const getRelevantMenuItemsDeclarations = (hitResult: paper.HitResult): IContextMenuItemDeclaration[] => {
    return contextMenuItemsDeclarations.filter(decl => decl.activeHitTypes.includes(hitResult.type));
}