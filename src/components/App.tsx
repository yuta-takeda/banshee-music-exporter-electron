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

  const handleExecButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const targetPlaylists = playlists.filter(playlist => playlist.checked);
    if (targetPlaylists.length === 0) {
      alert("プレイリストを選択してください。");
      return;
    }

    const result = window.confirm("楽曲の転送を開始します。よろしいですか？");
    if (!result) return;

    targetPlaylists.forEach(playlist => {
      window.core.createPlaylist(playlist);
    });

    // sync tracks

    alert("楽曲の転送が完了しました。");
  };

  return (
    <div>
      <Playlist playlists={playlists} handleClick={handleClick} handleExecButton={handleExecButton} />
      <MessageBox tracksCount={statistics.tracksCount} allFileSize={statistics.allFileSize} />
      <LogBox log="**********" />
    </div>
  );
};

export default App;
