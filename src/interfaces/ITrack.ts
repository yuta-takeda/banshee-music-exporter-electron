import IAlbum from "./IAlbum";
import IArtist from "./IArtist";

interface ITrack {
  trackId: number;
  artist: IArtist;
  album: IAlbum;
  uri: string;
  fileSize: number;
  title: string;
  duration: number;
}

export default ITrack;
