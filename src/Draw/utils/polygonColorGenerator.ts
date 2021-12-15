import paper from 'paper';

import { GlobalConfig } from './globalConfig';

class WrappingNumber {
    private value: number;
    private max: number;

    constructor(startValue: number, max: number) {
        this.value = startValue;
        this.max = max;
    }

    public valueOf(): number {
        return Math.abs(this.value % this.max);
    }

    public add(value: number) {
        this.value += value;
    }

    public subtract(value: number) {
        this.value -= value;
    }
}

let r = new WrappingNumber(0.99, 1);
let g = new WrappingNumber(0, 1);
let b = new WrappingNumber(0, 1);

export const polygonColorGenerator = (): paper.Color => {
    const color = new paper.Color(r.valueOf(), g.valueOf(), b.valueOf(), GlobalConfig.get('polygonTransparency'));

    r.add(0.32);
    g.add(0.46);
    b.add(0.65);

    return color;
}