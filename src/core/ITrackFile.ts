import ITrack from "../interfaces/ITrack";
import IRemoteTrack from "../interfaces/IRemoteTrack";

export default interface ITrackFile {
  transfer: (track: ITrack, basePath: string) => Promise<IRemoteTrack>;
  removeFromRemote: (remoteTracks: IRemoteTrack[], uniqTracks: ITrack[]) => Promise<void>;
  exists: (path: string) => boolean;
}

declare global {
  interface Window {
    trackFile: ITrackFile;
  }
}
