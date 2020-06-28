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
    width: 500,
    height: 475,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: true,
      nativeWindowOpen: true,
      preload: path.join(__dirname, "./core/preLoad.js"),
    },
  });

  win.loadFile("./index.html");
  win.removeMenu();
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

ipcMain.on("generate-playlists", (event, args) => {
  const playlists: IPlaylist[] = args[0];
  const basePath: string = args[1];

  playlistFile.clearAll(basePath);
  playlists.forEach(playlist => {
    playlistFile.create(playlist, basePath);
    event.reply("generate-playlist", playlist);
  });

  event.reply("generate-playlists-all", "プレイリストの作成が完了しました");
});

ipcMain.on("transfer-tracks", (event, args) => {
  const tracks: ITrack[] = args[0];
  const basePath: string = args[1];

  const tracksCount = tracks.length;
  const remoteTracks = tracks.map(async (track, idx) => {
    const result = await trackFile.transfer(track, basePath);
    const progress = `${idx + 1} / ${tracksCount}`;
    event.reply("transfer-track", result, progress);
    return result;
  });
  Promise.all(remoteTracks).then(results => {
    event.reply("transfer-tracks-all", results);
  });
});

ipcMain.on("remove-tracks", (event, args) => {
  const remoteTracks: IRemoteTrack[] = args[0];
  const tracks: ITrack[] = args[1];

  trackFile.removeFromRemote(remoteTracks, tracks).then(() => {
    event.reply("remove-tracks", "同期対象外の楽曲ファイルを削除しました");
  });
})
