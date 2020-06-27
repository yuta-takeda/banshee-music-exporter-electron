import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import IPlaylist from "./interfaces/IPlaylist";
import ITrack from "./interfaces/ITrack";
import IRemoteTrack from "./interfaces/IRemoteTrack";

import playlistFile from "./core/playlistFile";
import trackFile from "./core/trackFile";

let win: BrowserWindow;
const createWindow = (): void => {
  win = new BrowserWindow({
    width: 350,
    height: 500,
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

  playlistFile.clearAll(basePath);
  playlists.forEach(playlist => {
    playlistFile.create(playlist, basePath);
  });
  return ["OK"];
});

ipcMain.handle("transfer-tracks", async (event, args) => {
  const tracks: ITrack[] = args[0];
  const basePath: string = args[1];

  const remoteTracks = tracks.map(track => {
    return trackFile.transfer(track, basePath);
  });
  return Promise.all(remoteTracks).then(results => results);
});

ipcMain.handle("remove-tracks", async (event, args) => {
  const remoteTracks: IRemoteTrack[] = args[0];
  const tracks: ITrack[] = args[1];

  await trackFile.removeFromRemote(remoteTracks, tracks);

  return ["OK"];
});
