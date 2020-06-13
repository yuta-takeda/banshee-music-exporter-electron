import ITrack from "./ITrack";

interface IPlaylist {
  playlistId: number;
  name: string;
  checked: boolean;
  entries?: ITrack[];
}

export default IPlaylist;
