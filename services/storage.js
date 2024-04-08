"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storage = new Map();
const useStorage = () => {
    return {
        get(key) {
            return storage.get(key);
        },
        set(key, value) {
            storage.set(key, value);
        },
        remove(key) {
            storage.delete(key);
        },
    };
};
exports.default = useStorage();
