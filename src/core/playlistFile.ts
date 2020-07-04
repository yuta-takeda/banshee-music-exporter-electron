import IPlaylist from "../interfaces/IPlaylist";
import path from "path";
import fs from "fs";
import { getRelativePath } from "./lib/getRelativePath";
import IPlaylistFile from "./IPlaylistFile";

const createText = (playlist: IPlaylist): string => {
  let m3uText = "#EXTM3U\n";
  playlist.entries?.forEach(track => {
    const sec = Math.ceil(track.duration);
    m3uText += `#EXINF:${sec},${track.title}\n`;
    m3uText += getRelativePath(track) + "\n";
  });

  return m3uText;
};

const create = (playlist: IPlaylist, basePath: string): void => {
  const m3uText = createText(playlist);
  const savePath = path.join(basePath, playlist.name + ".m3u");
  fs.writeFileSync(savePath, m3uText);
};

const clearAll = (basePath: string): void => {
  fs.readdirSync(basePath, { withFileTypes: true }).forEach(file => {
    if (file.isFile() && path.extname(file.name) === ".m3u") {
      fs.unlinkSync(path.join(basePath, file.name));
    }
  });
};

const playlistFile: IPlaylistFile = {
  create,
  clearAll,
};

export default playlistFile;
