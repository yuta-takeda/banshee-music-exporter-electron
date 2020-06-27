import { contextBridge } from "electron";
import config from "./config";
import ipc from "./ipc";
import playlistFile from "./playlistFile";
import sql from "./sql";
import trackFile from "./trackFile";
import trackStatistic from "./trackStatistic";

contextBridge.exposeInMainWorld("config", config);
contextBridge.exposeInMainWorld("ipc", ipc);
contextBridge.exposeInMainWorld("playlistFile", playlistFile);
contextBridge.exposeInMainWorld("sql", sql);
contextBridge.exposeInMainWorld("trackFile", trackFile);
contextBridge.exposeInMainWorld("trackStatistic", trackStatistic);
