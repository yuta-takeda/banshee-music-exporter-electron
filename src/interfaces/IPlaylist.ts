import ITrack from "./ITrack";

interface IPlaylist {
  playlistId: number;
  name: string;
  type: "smart" | "normal";
  checked: boolean;
  entries?: ITrack[];
}

export default IPlaylist;
