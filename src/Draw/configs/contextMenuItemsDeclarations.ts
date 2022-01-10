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
                hitResult.item.remove();
            }
        }
    },
    {
        name: 'deleteVertex',
        label: 'Удалить вершину',
        activeHitTypes: ['segment'],
        action: (hitResult: paper.HitResult) => {
            if (hitResult.item instanceof Polygon) {
                if (hitResult.item.segments.length === 2) {
                    hitResult.item.remove();
                }

                hitResult.item.removeVertex(hitResult.segment);
            }
        }
    }
]

export const getRelevantMenuItemsDeclarations = (hitResult: paper.HitResult): IContextMenuItemDeclaration[] => {
    return contextMenuItemsDeclarations.filter(decl => decl.activeHitTypes.includes(hitResult.type));
}