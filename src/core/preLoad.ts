import { contextBridge } from "electron";
import config from "./config";
import playlistFile from "./playlistFile";
import sql from "./sql";
import trackFile from "./trackFile";
import trackStatistic from "./trackStatistic";
import common from "./common";
import { ipcRenderer, IpcRenderer } from "electron";

declare global {
  interface Window {
    api: IpcRenderer;
  }
}

contextBridge.exposeInMainWorld("config", config);
contextBridge.exposeInMainWorld("playlistFile", playlistFile);
contextBridge.exposeInMainWorld("sql", sql);
contextBridge.exposeInMainWorld("trackFile", trackFile);
contextBridge.exposeInMainWorld("trackStatistic", trackStatistic);
contextBridge.exposeInMainWorld("common", common);
contextBridge.exposeInMainWorld("api", {
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel: string, func: (event: any, ...arg: any[]) => void) => {
    ipcRenderer.on(channel, func);
  },
});
