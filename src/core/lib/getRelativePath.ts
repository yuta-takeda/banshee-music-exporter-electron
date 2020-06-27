import ITrack from "../../interfaces/ITrack";
import path from "path";
import sanitize from "sanitize-filename";

export const getRelativePath = (track: ITrack): string => {
  const trackName = path.basename(track.path);
  const artist = track.artist ? sanitize(track.artist, { replacement: "_" }) : "不明なアーティスト";
  const album = track.album ? sanitize(track.album, { replacement: "_" }) : "不明なアルバム";
  const trackPath = `${artist}/${album}/${sanitize(trackName, { replacement: "_" })}`;
  return trackPath;
};
