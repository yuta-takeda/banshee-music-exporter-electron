import IIpc from "./IIpc";
import { ipcRenderer } from "electron";

const request = async (channel: string, data: any[]): Promise<any[]> => {
  return await ipcRenderer.invoke(channel, data);
};

const send = (channel: string, data: any[]): void => {
  console.log(data);
  ipcRenderer.send(channel, data);
};

const test = (channel: string, callback: (event: any, ...arg: any) => void) => {
  ipcRenderer.on(channel, callback);
};

const ipc: IIpc = {
  request,
  send,
  test,
};

export default ipc;
