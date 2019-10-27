export {};

declare global {
    interface Window {
        graphaidDebug: { nodeLabels: boolean }
    }
}