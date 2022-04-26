import type paper from 'paper';

import { PolygonCenterGroup } from '../PolygonCenterGroup';
import { Polygon } from '../Polygon';
import { DraggableCenterPoint } from '../DraggableCenterPoint';

const hitTestConfig = {
    stroke: true,
    fill: true,
    segments: true,
};

class HitTester {
    private polygonGroupHitResultInternal: paper.HitResult | null = null;
    private polygonHitResultInternal: paper.HitResult | null = null;
    private polygonCenterHitResultInternal: paper.HitResult | null = null;

    constructor(event: paper.ToolEvent) {
        if (!event.item) {
            return;
        }

        const hits = event.item.hitTestAll(event.point, hitTestConfig);

        hits.forEach(hit => {
            switch (true) {
                case hit.item instanceof PolygonCenterGroup: {
                    this.polygonGroupHitResultInternal = hit;
                    break;
                }
                case hit.item instanceof Polygon: {
                    this.polygonHitResultInternal = hit;
                    break;
                }
                case hit.item.parent instanceof DraggableCenterPoint: {
                    hit.item = hit.item.parent;

                    this.polygonCenterHitResultInternal = hit;
                    break;
                }
                default:
                    break;
            }
        }, this);
    }

    public get didHitPolygonGroup(): boolean {
        return Boolean(this.polygonGroupHitResultInternal);
    }

    public get didHitPolygon(): boolean {
        return Boolean(this.polygonHitResultInternal);
    }

    public get didHitPolygonCenter(): boolean {
        return Boolean(this.polygonCenterHitResultInternal);
    }

    public get polygonGroupHitResult(): paper.HitResult | null {
        return this.polygonGroupHitResultInternal;
    }

    public get polygonHitResult(): paper.HitResult | null {
        return this.polygonHitResultInternal;
    }

    public get polygonCenterHitResult(): paper.HitResult | null {
        return this.polygonCenterHitResultInternal;
    }
}

export { HitTester };
