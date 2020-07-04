import ITrack from "./ITrack";

interface IStatistics {
  tracksCount: number;
  allFileSize: number;
  uniqTracks: ITrack[];
}

export default IStatistics;
