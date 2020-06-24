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
      <Label pointing="below" style={{ width: "75%" }}>
        同期したいプレイリストを選択
      </Label>
      <Segment.Group style={{ margin: "0" }}>
        <Segment textAlign={"left"} style={{ overflow: "auto", height: "250px" }}>
          {playlistElements}
        </Segment>
        <Segment size={"small"} style={{ padding: "7px" }}>
          {props.tracksCount} 曲 - {formatBytes(props.allFileSize)}
        </Segment>
      </Segment.Group>
      <Button icon labelPosition="right" onClick={props.handleExecButton} style={{ width: "50%" }}>
        同期
        <Icon name={"sync alternate"} />
      </Button>
    </PlaylistBox>
  );
};

export default Playlist;
