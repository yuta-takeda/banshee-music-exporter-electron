import React from "react";
import styled from "styled-components";
import { Segment, Button, Icon, Label } from "semantic-ui-react";
import PlaylistItem from "./PlaylistItem";
import IPlaylist from "../interfaces/IPlaylist";
import "../core/ICore";

interface IProps {
  playlists: IPlaylist[];
  tracksCount: number;
  allFileSize: number;
  handleClick(e: React.MouseEvent<HTMLInputElement>): void;
  handleExecButton(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

const PlaylistBox = styled.div`
  margin: 1em 0;
`;

const SyncSegment = styled(Segment)`
  padding: 7px !important;
  background: linear-gradient(#1ec0ff, #1ea0ff) !important;
  &:hover {
    background: linear-gradient(#1ed0ff, #1eb0ff) !important;
    cursor: pointer;
  }
`;

const Playlist: React.FC<IProps> = props => {
  const playlistElements = props.playlists.map(playlist => {
    return (
      <PlaylistItem playlist={playlist} handleClick={props.handleClick} key={playlist.type + playlist.playlistId} />
    );
  });

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <PlaylistBox>
      <Segment.Group style={{ margin: "0" }}>
        <Segment textAlign={"left"} style={{ overflow: "auto", height: "300px" }}>
          {playlistElements}
        </Segment>
        <Segment size={"small"} style={{ padding: "7px" }}>
          {props.tracksCount} 曲 - {formatBytes(props.allFileSize)}
        </Segment>
        <SyncSegment size={"small"} onClick={props.handleExecButton}>
          <Icon name={"sync alternate"} />
          同期
        </SyncSegment>
      </Segment.Group>
    </PlaylistBox>
  );
};

export default Playlist;
