import IPlaylist from "../interfaces/IPlaylist";
import ITrack from "../interfaces/ITrack";
import IStatistics from "../interfaces/IStatistics";
import ITrackStatistic from "./ITrackStatistic";

const calc = (statistics: IStatistics, playlists: IPlaylist[]): IStatistics => {
  const allTracks: ITrack[] = [];
  playlists.forEach(playlist => {
    playlist.entries?.forEach(track => {
      allTracks.push(track);
    });
  });
  const uniqTracks = Array.from(new Set(allTracks));

  const tracksCount = uniqTracks.length;
  const allFileSize = uniqTracks.reduce((prev, current) => {
    return prev + current.fileSize;
  }, 0);

  const newStatistics = { tracksCount: tracksCount, allFileSize: allFileSize, uniqTracks: uniqTracks };
  return newStatistics;
};

const trackStatistic: ITrackStatistic = {
  calc,
};

export default trackStatistic;
