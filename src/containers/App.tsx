import React, { useState, useEffect, useCallback } from "react";
import AppComponent from "../components/App";
import IPlaylist from "../interfaces/IPlaylist";
import IStatistics from "../interfaces/IStatistics";
import IRemoteTrack from "../interfaces/IRemoteTrack";

import "../core/IConfig";
import "../core/IPlaylistFile";
import "../core/ISql";
import "../core/ITrackFile";
import "../core/ITrackStatistic";

const App: React.FC = () => {
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [basePath, setBasePath] = useState<string>("");
  const [syncing, setSyncing] = useState<boolean>(false);
  const [statistics, setStatistics] = useState<IStatistics>({ tracksCount: 0, allFileSize: 0, uniqTracks: [] });
  const [newRemoteTracks, setNewRemoteTracks] = useState<IRemoteTrack[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const activePlaylists: string[] = window.config.read("activePlayLists", []);
    window.sql.getPlaylists().then(playlists => {
      const checkedPlaylistsPromise = playlists.map(async playlist => {
        if (activePlaylists.includes(playlist.type + playlist.playlistId)) {
          const tracks = await window.sql.getTracks(playlist.type, playlist.playlistId);
          return { ...playlist, checked: true, entries: tracks };
        } else {
          return playlist;
        }
      });
      Promise.all(checkedPlaylistsPromise).then(newPlaylists => {
        setPlaylists(newPlaylists);

        const newStatistics = window.trackStatistic.calc(statistics, newPlaylists);
        setStatistics(newStatistics);
        setMessage(`${newStatistics.tracksCount} songs - ${window.common.formatBytes(newStatistics.allFileSize)}`);
      });
    });
    const saveBasePath = window.config.read("saveBasePath", "");
    setBasePath(saveBasePath);
  }, []);

  const handleCheckBox = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      const key = e.currentTarget.dataset.key;

      const updated = playlists.map(async playlist => {
        if (playlist.type + playlist.playlistId === key) {
          // 現在チェックされている = 未チェック状態になる場合
          if (playlist.checked) {
            return { ...playlist, checked: false, entries: [] };
          }

          const tracks = await window.sql.getTracks(playlist.type, playlist.playlistId);
          return { ...playlist, checked: true, entries: tracks };
        }
        return playlist;
      });

      Promise.all(updated).then(newPlaylists => {
        setPlaylists(newPlaylists);

        const activePlayListsKeys = newPlaylists
          .filter(playlist => playlist.checked)
          .map(playlist => {
            return playlist.type + playlist.playlistId;
          });
        window.config.write("activePlayLists", activePlayListsKeys);

        const newStatistics = window.trackStatistic.calc(statistics, newPlaylists);
        setStatistics(newStatistics);
        setMessage(`${newStatistics.tracksCount} songs - ${window.common.formatBytes(newStatistics.allFileSize)}`);
      });
    },
    [playlists],
  );

  const handlePathBox = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBasePath(e.currentTarget.value);
      window.config.write("saveBasePath", e.currentTarget.value);
    },
    [basePath],
  );

  const handleExecButton = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (!window.trackFile.exists(basePath)) {
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

      setSyncing(true);

      window.api.send("generate-playlists", [targetPlaylists, basePath]);

      window.api.on("generate-playlist", (event, playlist: IPlaylist) => {
        setMessage(() => `プレイリスト：${playlist.name}を作成しました`);
      });

      window.api.on("generate-playlists-all", (event, arg) => {
        setMessage(() => "プレイリストの生成が完了しました");
        window.api.send("transfer-tracks", [statistics.uniqTracks, basePath]);
      });

      window.api.on("transfer-track", (event, track: IRemoteTrack, progress: string) => {
        if (track.skip) {
          setMessage(() => `[ ${progress} ] skip: ${track.artist} - ${track.title}`);
        } else {
          setMessage(() => `[ ${progress} ] copy: ${track.artist} - ${track.title}`);
        }
      });

      window.api.on("transfer-tracks-all", (event, newRemoteTracks: IRemoteTrack[]) => {
        setMessage(() => "楽曲の転送が完了しました");
        const remoteTracks = window.config.read("remoteTracks", []);
        setNewRemoteTracks(newRemoteTracks);
        window.api.send("remove-tracks", [remoteTracks, statistics.uniqTracks]);
      });

      window.api.on("remove-tracks", (event, msg: string) => {
        const toWriteTracks = newRemoteTracks.map<IRemoteTrack>(track => {
          return { path: track.path, trackId: track.trackId, skip: track.skip };
        });
        window.config.write("remoteTracks", toWriteTracks);

        setSyncing(false);
        setMessage(`${statistics.tracksCount} songs - ${window.common.formatBytes(statistics.allFileSize)}`);
        alert("楽曲の転送が完了しました！");
      });
    },
    [basePath, playlists, statistics, newRemoteTracks],
  );

  return (
    <AppComponent
      basePath={basePath}
      playlists={playlists}
      tracksCount={statistics.tracksCount}
      allFileSize={statistics.allFileSize}
      syncing={syncing}
      message={message}
      handlePathBox={handlePathBox}
      handleCheckBox={handleCheckBox}
      handleExecButton={handleExecButton}
    />
  );
};

export default App;
