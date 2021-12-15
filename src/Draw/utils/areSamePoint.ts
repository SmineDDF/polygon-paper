import paper from 'paper';

export function areSamePoint(pointA: paper.Point, pointB: paper.Point, tolerance: number): boolean {
    return Math.abs(pointA.x - pointB.x) < tolerance && Math.abs(pointA.y - pointB.y) < tolerance;
}
