declare let browser: any;
declare const init: (options?: {}) => Promise<any>;
declare const goTo: (url: string) => Promise<any>;
declare const close: () => Promise<void>;
export { browser, init, goTo, close };
