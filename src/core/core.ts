import sqlite from "sqlite3";
import Store from "electron-store";
import os from "os";
import path from "path";
import ICore from "./ICore";
import IPlaylist from "../interfaces/IPlaylist";
import ITrack from "../interfaces/ITrack";
import IStatistics from "../interfaces/IStatistics";
import IRemoteTrack from "../interfaces/IRemoteTrack";
import { writeFileSync, existsSync, statSync, copyFileSync, mkdirSync, unlinkSync, readdirSync, rmdirSync } from "fs";
import { fileURLToPath } from "url";
import sanitize from "sanitize-filename";
import { ipcRenderer } from "electron";

const DB_PATH = path.join(os.homedir(), "/.config/banshee-1/banshee.db");

const bansheeDB: sqlite.Database = new sqlite.Database(DB_PATH);

const store = new Store({ name: "banshee-electron-config" });

const writeConfig = (key: string, value: any) => {
  store.set(key, value);
};

const getConfig = (key: string, defaulyValue: any): any => {
  return store.get(key, defaulyValue);
};

const test = async (): Promise<void> => {
  const db = new sqlite.Database(":memory:");
  db.close();
  await console.log("OK!");
};

const getNormalPlaylists = async (): Promise<IPlaylist[]> => {
  return new Promise(resolve => {
    bansheeDB.serialize(() => {
      bansheeDB.all("SELECT PlaylistID, Name from CorePlaylists", (err, rows) => {
        if (err) throw err;
        const playlists: IPlaylist[] = rows.map(row => {
          return { playlistId: row.PlaylistID, name: row.Name, type: "normal", checked: false };
        });
        resolve(playlists);
      });
    });
  });
};

const getSmartPlaylists = async (): Promise<IPlaylist[]> => {
  return new Promise(resolve => {
    bansheeDB.serialize(() => {
      bansheeDB.all("SELECT SmartPlaylistID, Name from CoreSmartPlaylists", (err, rows) => {
        if (err) throw err;
        const playlists: IPlaylist[] = rows.map(row => {
          return { playlistId: row.SmartPlaylistID, name: row.Name, type: "smart", checked: false };
        });
        resolve(playlists);
      });
    });
  });
};

const getPlaylists = async (): Promise<IPlaylist[]> => {
  const normalPlists = await getNormalPlaylists();
  const smartPlists = await getSmartPlaylists();
  return [normalPlists, smartPlists].flat().sort((a, b) => {
    const nameA = a.name;
    const nameB = b.name;
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
};

const getTrackIds = async (type: string, playlistId: number): Promise<number[]> => {
  return new Promise(resolve => {
    bansheeDB.serialize(() => {
      const playlistTable = type === "smart" ? "CoreSmartPlaylistEntries" : "CorePlaylistEntries";
      const idColumn = type === "smart" ? "SmartPlaylistID" : "PlaylistID";

      bansheeDB.all(
        `
        SELECT TrackID from ${playlistTable} where ${idColumn} = ${playlistId}
        `,
        (err, rows) => {
          if (err) throw err;
          const trackIds = rows.map(row => row.TrackID);
          resolve(trackIds);
        },
      );
    });
  });
};

const getTracks = async (type: string, playlistId: number): Promise<ITrack[]> => {
  const trackIds = await getTrackIds(type, playlistId);
  console.log(trackIds.join(", "));
  return new Promise(resolve => {
    bansheeDB.serialize(() => {
      bansheeDB.all(
        `
        SELECT TrackID, Uri, FileSize, CoreTracks.Title AS TrackTitle, CoreArtists.Name AS ArtistName,
        CoreAlbums.Title AS AlbumTitle, CoreTracks.Duration
        FROM CoreTracks
        LEFT OUTER JOIN CoreArtists ON CoreTracks.ArtistID = CoreArtists.ArtistID
        LEFT OUTER JOIN CoreAlbums ON CoreTracks.AlbumID = CoreAlbums.AlbumID
        WHERE TrackID IN (${trackIds.join(", ")})
        `,
        (err, rows) => {
          if (err) throw err;
          console.log(rows);
          const tracks: ITrack[] = rows.map(row => {
            return {
              trackId: row.TrackID,
              artist: row.ArtistName,
              album: row.AlbumTitle,
              path: fileURLToPath(row.Uri),
              fileSize: row.FileSize,
              title: row.TrackTitle,
              duration: row.Duration,
            };
          });
          resolve(tracks);
        },
      );
    });
  });
};

const calcStatistics = (statistics: IStatistics, playlists: IPlaylist[]): IStatistics => {
  const allTracks: ITrack[] = [];
  playlists.forEach(playlist => {
    playlist.entries?.forEach(track => {
      allTracks.push(track);
    });
  });
  const uniqTracks = Array.from(new Set(allTracks));

  const tracksCount = uniqTracks.length;
  const allFileSize = uniqTracks.reduce((prev, current) => {
    return prev + current.fileSize;
  }, 0);

  const newStatistics = { tracksCount: tracksCount, allFileSize: allFileSize, uniqTracks: uniqTracks };
  return newStatistics;
};

const createPlaylist = (playlist: IPlaylist, basePath: string): void => {
  const m3uText = createPlaylistText(playlist);
  const savePath = path.join(basePath, playlist.name + ".m3u");
  writeFileSync(savePath, m3uText);
};

const createPlaylistText = (playlist: IPlaylist): string => {
  let m3uText = "#EXTM3U\n";
  playlist.entries?.forEach(track => {
    const sec = Math.ceil(track.duration);
    m3uText += `#EXINF:${sec},${track.title}\n`;
    m3uText += getRelativePath(track) + "\n";
  });
  return m3uText;
};

const getRelativePath = (track: ITrack): string => {
  const trackName = path.basename(track.path);
  const trackPath = `${sanitize(track.artist, { replacement: "_" })}/${sanitize(track.album, {
    replacement: "_",
  })}/${sanitize(trackName, { replacement: "_" })}`;
  return trackPath;
};

const transferTrack = (track: ITrack, basePath: string): IRemoteTrack => {
  const relativePath = getRelativePath(track);
  const absolutePath = path.join(basePath, relativePath);
  if (!existsSync(path.dirname(absolutePath))) {
    mkdirSync(path.dirname(absolutePath), { recursive: true });
  }

  if (
    !existsSync(absolutePath) ||
    (existsSync(absolutePath) && statSync(absolutePath).mtime < statSync(track.path).mtime)
  ) {
    console.log(`transfer -> ${absolutePath}`);
    copyFileSync(track.path, absolutePath);
  }
  return { path: absolutePath, trackId: track.trackId };
};

const removeTracks = (remoteTracks: IRemoteTrack[], uniqTracks: ITrack[]) => {
  const uniqTrackIds = uniqTracks.map(track => track.trackId);
  const toRemoveTrackIds = remoteTracks.filter(remoteTrack => !uniqTrackIds.includes(remoteTrack.trackId));
  toRemoveTrackIds.forEach(track => {
    if (existsSync(track.path)) {
      console.log(`unlink -> ${track.path}`);
      unlinkSync(track.path);

      // TODO: 再帰的に行うべき
      if (readdirSync(path.dirname(track.path)).length === 0) {
        rmdirSync(path.dirname(track.path));
      }
    }
  });
};

const isFileExists = (path: string): boolean => {
  return existsSync(path);
};

const ipcRequest = async (channel: string, data: any[]): Promise<any[]> => {
  const result = await ipcRenderer.invoke(channel, data);
  return result;
};

const core: ICore = {
  test,
  writeConfig,
  getConfig,
  getPlaylists,
  getTracks,
  calcStatistics,
  createPlaylist,
  transferTrack,
  removeTracks,
  isFileExists,
  ipcRequest,
};

export default core;
