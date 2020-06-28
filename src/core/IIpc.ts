export default interface IIpc {
  request: (channel: string, data: any[]) => Promise<any[]>;
  send: (channel: string, data: any[]) => void;
  test: (channel: string, callback: (event: any, arg: any) => void) => void;
}

declare global {
  interface Window {
    ipc: IIpc;
  }
}
