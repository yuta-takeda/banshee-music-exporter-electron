import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import "semantic-ui-css/semantic.min.css";
import { Segment } from "semantic-ui-react";
import Playlist from "./Playlist";
import LogBox from "./LogBox";
import PathBox from "./PathBox";
import IPlaylist from "../interfaces/IPlaylist";
import IStatistics from "../interfaces/IStatistics";
import IRemoteTrack from "../interfaces/IRemoteTrack";

import "../core/IConfig";
import "../core/IPlaylistFile";
import "../core/ISql";
import "../core/ITrackFile";
import "../core/ITrackStatistic";

const BaseSegment = styled(Segment)`
  background: #e6e6e6 !important;
  height: 100%;
`;

const App: React.FC = () => {
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [log, setLog] = useState<string[]>([]);
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
        setMessage(`${newStatistics.tracksCount} songs - ${formatBytes(newStatistics.allFileSize)}`);
      });
    });
    const saveBasePath = window.config.read("saveBasePath", "");
    setBasePath(saveBasePath);
  }, []);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleClick = useCallback(
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
        setMessage(`${newStatistics.tracksCount} songs - ${formatBytes(newStatistics.allFileSize)}`);
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
        // setLog(log => [...log, `プレイリスト：${playlist.name}を作成しました`]);
        setMessage(() => `プレイリスト：${playlist.name}を作成しました`);
      });

      window.api.on("generate-playlists-all", (event, arg) => {
        // setLog(log => [...log, "プレイリストの生成が完了しました"]);
        setMessage(() => "プレイリストの生成が完了しました");
        window.api.send("transfer-tracks", [statistics.uniqTracks, basePath]);
      });

      window.api.on("transfer-track", (event, track: IRemoteTrack, progress: string) => {
        if (track.skip) {
          setMessage(() => `[ ${progress} ] skip: ${track.artist} - ${track.title}`);
          // setLog(log => [...log, `[ ${progress} ] skip: ${track.artist} - ${track.title}`]);
        } else {
          setMessage(() => `[ ${progress} ] copy: ${track.artist} - ${track.title}`);
          // setLog(log => [...log, `[ ${progress} ] copy: ${track.artist} - ${track.title}`]);
        }
      });

      window.api.on("transfer-tracks-all", (event, newRemoteTracks: IRemoteTrack[]) => {
        // setLog(log => [...log, "楽曲の転送が完了しました"]);
        setMessage(() => "楽曲の転送が完了しました");
        const remoteTracks = window.config.read("remoteTracks", []);
        setNewRemoteTracks(newRemoteTracks);
        window.api.send("remove-tracks", [remoteTracks, statistics.uniqTracks]);
      });

      window.api.on("remove-tracks", (event, msg: string) => {
        // setLog(log => [...log, msg]);
        const toWriteTracks = newRemoteTracks.map<IRemoteTrack>(track => {
          return { path: track.path, trackId: track.trackId, skip: track.skip };
        });
        window.config.write("remoteTracks", toWriteTracks);

        setSyncing(false);
        setMessage(`${statistics.tracksCount} songs - ${formatBytes(statistics.allFileSize)}`);
        alert("楽曲の転送が完了しました！");
      });
    },
    [basePath, playlists, statistics, newRemoteTracks],
  );

  return (
    <BaseSegment basic textAlign={"center"}>
      <PathBox basePath={basePath} handlePathBox={handlePathBox} />
      <Playlist
        playlists={playlists}
        handleClick={handleClick}
        handleExecButton={handleExecButton}
        tracksCount={statistics.tracksCount}
        allFileSize={statistics.allFileSize}
        syncing={syncing}
        msg={message}
      />
      {/* <LogBox log={log} /> */}
    </BaseSegment>
  );
};

export default App;
