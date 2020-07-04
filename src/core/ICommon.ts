export default interface ICommon {
  formatBytes: (bytes: number) => string;
}

declare global {
  interface Window {
    common: ICommon;
  }
}
