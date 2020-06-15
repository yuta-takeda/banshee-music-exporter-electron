import sqlite from "sqlite3";
import os from "os";
import path from "path";
import ICore from "./ICore";
import IPlaylist from "../interfaces/IPlaylist";
import ITrack from "../interfaces/ITrack";
import IStatistics from "../interfaces/IStatistics";
import { stat } from "fs";

const DB_PATH = path.join(os.homedir(), "/.config/banshee-1/banshee.db");

const bansheeDB: sqlite.Database = new sqlite.Database(DB_PATH);

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
              uri: row.Uri,
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

const core: ICore = {
  test,
  getPlaylists,
  getTracks,
  calcStatistics,
};

export default core;
