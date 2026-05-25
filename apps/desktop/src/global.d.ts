export {};

declare global {
  interface Window {
    kiteDesktop?: {
      platform: NodeJS.Platform;
      version: string;
    };
  }
}
