import React, { useState, useEffect } from "react";
import Playlist from "./Playlist";
import MessageBox from "./MessageBox";
import LogBox from "./LogBox";
import IPlaylist from "../interfaces/IPlaylist";
import ITrack from "../interfaces/ITrack";
import IStatistics from "../interfaces/IStatistics";

const App: React.FC = () => {
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [statistics, setStatistics] = useState<IStatistics>({ tracksCount: 0, allFileSize: 0, uniqTracks: [] });

  useEffect(() => {
    window.core.getPlaylists().then(result => {
      setPlaylists(result);
    });
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const key = e.currentTarget.dataset.key;

    const updated = playlists.map(async playlist => {
      if (playlist.type + playlist.playlistId === key) {
        // 現在チェックされている = 未チェック状態になる場合
        if (playlist.checked) {
          return { ...playlist, checked: !playlist.checked, entries: [] };
        }

        const tracks = await window.core.getTracks(playlist.type, playlist.playlistId);
        return { ...playlist, checked: !playlist.checked, entries: tracks };
      }
      return playlist;
    });

    Promise.all(updated).then(newPlaylists => {
      setPlaylists(newPlaylists);

      const newStatistics = window.core.calcStatistics(statistics, newPlaylists);
      setStatistics(newStatistics);
    });
  };

  return (
    <div>
      <Playlist playlists={playlists} handleClick={handleClick} />
      <MessageBox tracksCount={statistics.tracksCount} allFileSize={statistics.allFileSize} />
      <LogBox log="**********" />
    </div>
  );
};

export default App;
