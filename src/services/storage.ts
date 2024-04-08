const useStorage = () => {
    const storage = new Map();

    return {
        get(key: string) {
            return storage.get(key);
        },
        set(key: string, value: string) {
            storage.set(key, value);
        },
        remove(key: string) {
            storage.delete(key);
        },
    }
}

export default useStorage()