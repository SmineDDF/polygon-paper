import { IDrawConfig } from '../types';
import { defaultConfig } from './defaultConfig';

class GlobalConfig {
    private static config: IDrawConfig = { ...defaultConfig };

    public static set<T extends keyof IDrawConfig>(key: T, value: IDrawConfig[T]) {
        this.config[key] = value;
    }

    public static get<T extends keyof IDrawConfig>(key: T) {
        return this.config[key];
    }

    public static setAll(config: IDrawConfig) {
        this.config = {
            ...this.config,
            ...config
        }
    }

    public static getAll() {
        return { ...this.config };
    }
}

export { GlobalConfig };
