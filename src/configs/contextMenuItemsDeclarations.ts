import type paper from 'paper';
import { Polygon } from '../Polygon';
import { GlobalConfig } from '../utils/globalConfig';

export interface IContextMenuItemDeclaration {
    name: string;
    label: string;
    activeHitTypes: Array<paper.HitResult['type']>;
    action: (hitResult: paper.HitResult, point: paper.Point, clickEvent: paper.MouseEvent) => void;
}

const contextMenuItemsDeclarations: Array<IContextMenuItemDeclaration> = [
    {
        name: 'deletePolygon',
        label: GlobalConfig.get('labelDeletePolygon'),
        activeHitTypes: [ 'fill', 'stroke', 'segment' ],
        action: (hitResult: paper.HitResult) => {
            if (hitResult.item instanceof Polygon) {
                const shouldConfirmDeletion = GlobalConfig.get('shouldConfirmPolygonDeletion');

                if (shouldConfirmDeletion) {
                    const deletionConfirmationText = GlobalConfig.get('labelDeletePolygonConfirm');

                    // eslint-disable-next-line no-alert
                    if (window.confirm(deletionConfirmationText)) {
                        hitResult.item.remove();
                    }
                }
            }
        },
    },
    {
        name: 'deleteVertex',
        label: GlobalConfig.get('labelDeleteVertex'),
        activeHitTypes: [ 'segment' ],
        action: (hitResult: paper.HitResult) => {
            if (hitResult.item instanceof Polygon) {
                if (hitResult.item.segments.length === 2) {
                    hitResult.item.remove();
                }

                hitResult.item.removeVertex(hitResult.segment);
            }
        },
    },
];

export const getRelevantMenuItemsDeclarations = (hitResult: paper.HitResult): Array<IContextMenuItemDeclaration> => {
    return contextMenuItemsDeclarations.filter(decl => decl.activeHitTypes.includes(hitResult.type));
};
