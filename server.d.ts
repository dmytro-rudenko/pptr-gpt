declare const server: ({ port, headless, }: {
    port?: number | undefined;
    headless?: boolean | undefined;
}) => Promise<void>;
export = server;
