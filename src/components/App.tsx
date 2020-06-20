import React, { useState, useEffect } from "react";
import Playlist from "./Playlist";
import MessageBox from "./MessageBox";
import LogBox from "./LogBox";
import PathBox from "./PathBox";
import IPlaylist from "../interfaces/IPlaylist";
import IStatistics from "../interfaces/IStatistics";

import "../core/ICore";

const App: React.FC = () => {
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [basePath, setBasePath] = useState<string>("");
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

  const handlePathBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBasePath(e.currentTarget.value);
  };

  const handleExecButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!window.core.isFileExists(basePath)) {
      alert("有効なポータブルオーディオのパスを指定してください。");
      return;
    }

    const targetPlaylists = playlists.filter(playlist => playlist.checked);
    if (targetPlaylists.length === 0) {
      alert("プレイリストを選択してください。");
      return;
    }

    const result = window.confirm("楽曲の転送を開始します。よろしいですか？");
    if (!result) return;

    const generatePlaylistPromise = window.core.ipcRequest("generate-playlists", [targetPlaylists, basePath]);

    const transferTrackPromise = window.core.ipcRequest("transfer-tracks", [statistics.uniqTracks, basePath]);

    Promise.all([generatePlaylistPromise, transferTrackPromise]).then(results => {
      alert("楽曲の転送が完了しました！");
    });
  };

  return (
    <div>
      <PathBox basePath={basePath} handlePathBox={handlePathBox} />
      <Playlist playlists={playlists} handleClick={handleClick} handleExecButton={handleExecButton} />
      <MessageBox tracksCount={statistics.tracksCount} allFileSize={statistics.allFileSize} />
      <LogBox log={log} />
    </div>
  );
};

export default App;
