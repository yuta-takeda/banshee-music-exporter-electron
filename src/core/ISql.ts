import IPlaylist from "../interfaces/IPlaylist";
import ITrack from "../interfaces/ITrack";

export default interface ISql {
  getPlaylists: () => Promise<IPlaylist[]>;
  getTracks: (type: string, playlistId: number) => Promise<ITrack[]>;
}

declare global {
  interface Window {
    sql: ISql;
  }
}
