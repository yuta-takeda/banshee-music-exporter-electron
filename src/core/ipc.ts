import IIpc from "./IIpc";
import { ipcRenderer } from "electron";

const request = async (channel: string, data: any[]): Promise<any[]> => {
  return await ipcRenderer.invoke(channel, data);
};

const ipc: IIpc = {
  request,
};

export default ipc;
