import ITrack from "./ITrack";

interface IPlaylist {
  playlistId: number;
  name: string;
  type: "smart" | "normal";
  checked: boolean;
  trackCount: number;
  entries?: ITrack[];
}

export default IPlaylist;
