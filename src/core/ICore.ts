import IPlaylist from "../interfaces/IPlaylist";
import ITrack from "../interfaces/ITrack";
import IStatistics from "../interfaces/IStatistics";

export default interface ICore {
  test: () => Promise<void>;
  getPlaylists: () => Promise<IPlaylist[]>;
  getTracks: (type: string, playlistId: number) => Promise<ITrack[]>;
  calcStatistics: (statistics: IStatistics, newTracks?: ITrack[]) => IStatistics;
}

declare global {
  interface Window {
    core: ICore;
  }
}
