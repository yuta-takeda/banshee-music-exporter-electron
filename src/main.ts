import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import IPlaylist from "./interfaces/IPlaylist";
import ITrack from "./interfaces/ITrack";
import core from "./core/core";
import IRemoteTrack from "./interfaces/IRemoteTrack";

let win: BrowserWindow;
const createWindow = (): void => {
  win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      contextIsolation: true,
      nativeWindowOpen: true,
      preload: path.join(__dirname, "./core/preLoad.js"),
    },
  });

  win.loadFile("./index.html");

  win.webContents.openDevTools();
};

app.allowRendererProcessReuse = false;

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("generate-playlists", (event, args) => {
  const playlists: IPlaylist[] = args[0];
  const basePath: string = args[1];

  playlists.forEach(playlist => {
    core.createPlaylist(playlist, basePath);
  });
  return ["OK"];
});

ipcMain.handle("transfer-tracks", (event, args) => {
  const tracks: ITrack[] = args[0];
  const basePath: string = args[1];

  const remoteTracks = tracks.map(track => {
    return core.transferTrack(track, basePath);
  });
  return [remoteTracks];
});

ipcMain.handle("remove-tracks", (event, args) => {
  const remoteTracks: IRemoteTrack[] = args[0];
  const tracks: ITrack[] = args[1];

  core.removeTracks(remoteTracks, tracks);

  return ["OK"];
});
