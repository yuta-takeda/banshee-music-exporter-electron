import IAlbum from "./IAlbum";
import IArtist from "./IArtist";

interface ITrack {
  trackId: number;
  artist: string;
  album: string;
  uri: string;
  fileSize: number;
  title: string;
  duration: number;
}

export default ITrack;
