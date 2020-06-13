import sqlite from "sqlite3";
import ICore from "./ICore";
import IPlaylist from "../interfaces/IPlaylist";
import os from "os";
import path from "path";

const DB_PATH = path.join(os.homedir(), "/.config/banshee-1/banshee.db");

const bansheeDB: sqlite.Database = new sqlite.Database(DB_PATH);

const test = async (): Promise<void> => {
  const db = new sqlite.Database(":memory:");
  db.close();
  await console.log("OK!");
};

const getPlaylists = async (): Promise<IPlaylist[]> => {
  return new Promise(resolve => {
    bansheeDB.serialize(() => {
      bansheeDB.all("SELECT PlaylistID, Name from CorePlaylists", (err, rows) => {
        if (err) throw err;
        const playlists: IPlaylist[] = rows.map(row => {
          return { playlistId: row.PlaylistID, name: row.Name, checked: false };
        });
        resolve(playlists);
      });
    });
  });
};

// const getPlaylists = (): void => {
//   bansheeDB.all("SELECT PlaylistID, Name from CorePlaylists", (err, rows) => {
//     if (err) throw err;
//     const playlists: void[] = rows.map(row => {
//       console.log(row);
//       // return { playlistId: row.playlistId, name: row.name, checked: false };
//     });
//     playlists;
//     return;
//   });
// };

const core: ICore = {
  test,
  getPlaylists,
};

export default core;
