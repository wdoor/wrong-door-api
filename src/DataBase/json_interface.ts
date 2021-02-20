/* eslint-disable no-restricted-syntax */
export default class JsonIntertface {
    constructor(json = {}) {
        Object.assign(this, json);
    }

    isfull(): boolean {
        for (const key in this) {
            if (this[key] === null) { return false; }
        }
        return true;
    }
}
