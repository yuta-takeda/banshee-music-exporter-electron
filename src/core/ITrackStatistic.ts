import IPlaylist from "../interfaces/IPlaylist";
import IStatistics from "../interfaces/IStatistics";

export default interface ITrackStatistic {
  calc: (statistics: IStatistics, playlists: IPlaylist[]) => IStatistics;
}

declare global {
  interface Window {
    trackStatistic: ITrackStatistic;
  }
}
