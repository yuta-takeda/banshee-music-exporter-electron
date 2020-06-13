import IPlaylist from "../interfaces/IPlaylist";

export default interface ICore {
  test: () => Promise<void>;
  getPlaylists: () => Promise<IPlaylist[]>;
}

declare global {
  interface Window {
    core: ICore;
  }
}
