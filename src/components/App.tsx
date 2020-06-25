import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "semantic-ui-css/semantic.min.css";
import { Segment } from "semantic-ui-react";
import Playlist from "./Playlist";
import LogBox from "./LogBox";
import PathBox from "./PathBox";
import IPlaylist from "../interfaces/IPlaylist";
import IStatistics from "../interfaces/IStatistics";
import IRemoteTrack from "../interfaces/IRemoteTrack";

import "../core/ICore";

const BaseSegment = styled(Segment)`
  background: #e6e6e6 !important;
  height: 100%;
`;

const App: React.FC = () => {
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [basePath, setBasePath] = useState<string>("");
  const [statistics, setStatistics] = useState<IStatistics>({ tracksCount: 0, allFileSize: 0, uniqTracks: [] });

  useEffect(() => {
    const activePlaylists: string[] = window.core.getConfig("activePlayLists", []);
    window.core.getPlaylists().then(playlists => {
      const checkedPlaylistsPromise = playlists.map(async playlist => {
        if (activePlaylists.includes(playlist.type + playlist.playlistId)) {
          const tracks = await window.core.getTracks(playlist.type, playlist.playlistId);
          return { ...playlist, checked: true, entries: tracks };
        } else {
          return playlist;
        }
      });
      Promise.all(checkedPlaylistsPromise).then(newPlaylists => {
        setPlaylists(newPlaylists);

        const newStatistics = window.core.calcStatistics(statistics, newPlaylists);
        setStatistics(newStatistics);
      });
    });
    const saveBasePath = window.core.getConfig("saveBasePath", "");
    setBasePath(saveBasePath);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const key = e.currentTarget.dataset.key;

    const updated = playlists.map(async playlist => {
      if (playlist.type + playlist.playlistId === key) {
        // 現在チェックされている = 未チェック状態になる場合
        if (playlist.checked) {
          return { ...playlist, checked: false, entries: [] };
        }

        const tracks = await window.core.getTracks(playlist.type, playlist.playlistId);
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
      window.core.writeConfig("activePlayLists", activePlayListsKeys);

      const newStatistics = window.core.calcStatistics(statistics, newPlaylists);
      setStatistics(newStatistics);
    });
  };

  const handlePathBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBasePath(e.currentTarget.value);
    window.core.writeConfig("saveBasePath", e.currentTarget.value);
  };

  const handleExecButton = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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

    window.core.ipcRequest("generate-playlists", [targetPlaylists, basePath]);
    window.core
      .ipcRequest("transfer-tracks", [statistics.uniqTracks, basePath])
      .then(async (newRemoteTracks: IRemoteTrack[]) => {
        const remoteTracks = window.core.getConfig("remoteTracks", []);
        await window.core.ipcRequest("remove-tracks", [remoteTracks, statistics.uniqTracks]);

        const toWriteTracks = newRemoteTracks.map<IRemoteTrack>(track => {
          return { path: track.path, trackId: track.trackId };
        });
        window.core.writeConfig("remoteTracks", toWriteTracks);

        alert("楽曲の転送が完了しました！");
      });
  };

  return (
    <BaseSegment basic textAlign={"center"}>
      <PathBox basePath={basePath} handlePathBox={handlePathBox} />
      <Playlist
        playlists={playlists}
        handleClick={handleClick}
        handleExecButton={handleExecButton}
        tracksCount={statistics.tracksCount}
        allFileSize={statistics.allFileSize}
      />
      {/* <LogBox log={log} /> */}
    </BaseSegment>
  );
};

export default App;
