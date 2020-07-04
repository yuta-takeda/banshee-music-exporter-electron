import ITrack from "../interfaces/ITrack";
import IRemoteTrack from "../interfaces/IRemoteTrack";
import ITrackFile from "./ITrackFile";
import fs from "fs";
import util from "util";
import path from "path";
import { getRelativePath } from "./lib/getRelativePath";

const transfer = async (track: ITrack, basePath: string): Promise<IRemoteTrack> => {
  const relativePath = getRelativePath(track);
  const absolutePath = path.join(basePath, relativePath);
  const remoteDirExists = await util.promisify(fs.exists)(path.dirname(absolutePath));
  if (!remoteDirExists) {
    await util.promisify(fs.mkdir)(path.dirname(absolutePath), { recursive: true });
  }

  const remoteTrackExists = await util.promisify(fs.exists)(absolutePath);
  if (!remoteTrackExists) {
    await util.promisify(fs.copyFile)(track.path, absolutePath);
    return { path: absolutePath, trackId: track.trackId, skip: false, artist: track.artist, title: track.title };
  } else {
    const remoteTrackStat = await util.promisify(fs.stat)(absolutePath);
    const localTrackStat = await util.promisify(fs.stat)(track.path);
    if (remoteTrackStat.mtime < localTrackStat.mtime) {
      await util.promisify(fs.copyFile)(track.path, absolutePath);
      return { path: absolutePath, trackId: track.trackId, skip: false, artist: track.artist, title: track.title };
    }
  }

  return { path: absolutePath, trackId: track.trackId, skip: true, artist: track.artist, title: track.title };
};

const removeFromRemote = async (remoteTracks: IRemoteTrack[], uniqTracks: ITrack[]): Promise<void> => {
  const uniqTrackIds = uniqTracks.map(track => track.trackId);
  const toRemoveTrackIds = remoteTracks.filter(remoteTrack => !uniqTrackIds.includes(remoteTrack.trackId));
  toRemoveTrackIds.forEach(async track => {
    const existsFile = await util.promisify(fs.exists)(track.path);
    if (existsFile) {
      console.log(`unlink -> ${track.path}`);
      await util.promisify(fs.unlink)(track.path);
    }
  });
};

const exists = (path: string): boolean => {
  return fs.existsSync(path);
};

const trackFile: ITrackFile = {
  transfer,
  removeFromRemote,
  exists,
};

export default trackFile;
