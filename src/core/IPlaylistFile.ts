import IPlaylist from "../interfaces/IPlaylist";

export default interface IPlaylistFile {
  create: (playlist: IPlaylist, basePath: string) => void;
  clearAll: (basePath: string) => void;
}

declare global {
  interface Window {
    playlistFile: IPlaylistFile;
  }
}
