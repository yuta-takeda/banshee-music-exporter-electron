import { IpcRenderer } from "electron";
import IPlaylist from "../interfaces/IPlaylist";
import ITrack from "../interfaces/ITrack";
import IStatistics from "../interfaces/IStatistics";

export default interface ICore {
  test: () => Promise<void>;
  getPlaylists: () => Promise<IPlaylist[]>;
  getTracks: (type: string, playlistId: number) => Promise<ITrack[]>;
  calcStatistics: (statistics: IStatistics, playlists: IPlaylist[]) => IStatistics;
  createPlaylist: (playlist: IPlaylist, basePath: string) => void;
  transferTrack: (track: ITrack, basePath: string) => string;
  isFileExists: (path: string) => boolean;
  ipcRequest: (channel: string, data: any[]) => Promise<any[]>;
}

declare global {
  interface Window {
    core: ICore;
  }
}
