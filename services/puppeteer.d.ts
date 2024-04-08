declare const _default: {
    browser: any;
    init: (options: {
        headless?: boolean | "shell" | undefined;
    }) => Promise<any>;
    goTo: (url: string) => Promise<any>;
    close: () => Promise<void>;
};
export default _default;
