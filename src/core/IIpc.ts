export default interface IIpc {
  request: (channel: string, data: any[]) => Promise<any[]>;
}

declare global {
  interface Window {
    ipc: IIpc;
  }
}
