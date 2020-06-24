import React from "react";
import styled from "styled-components";
import { Segment, Button, Icon, Label } from "semantic-ui-react";
import PlaylistItem from "./PlaylistItem";
import IPlaylist from "../interfaces/IPlaylist";
import "../core/ICore";

interface IProps {
  playlists: IPlaylist[];
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

  return (
    <PlaylistBox>
      <Label pointing="below" style={{ width: "75%" }}>
        同期したいプレイリストを選択
      </Label>
      <Segment textAlign={"left"} style={{ overflow: "auto", height: "250px", margin: "0" }}>
        {playlistElements}
      </Segment>
      <Button icon labelPosition="right" onClick={props.handleExecButton} style={{ width: "50%" }}>
        同期
        <Icon name={"sync alternate"} />
      </Button>
    </PlaylistBox>
  );
};

export default Playlist;
