import React from "react";
import styled from "styled-components";
import PlaylistItem from "./PlaylistItem";
import IPlaylist from "../interfaces/IPlaylist";
import "../core/ICore";

interface IProps {
  playlists: IPlaylist[];
  handleClick(e: React.MouseEvent<HTMLInputElement>): void;
  handleExecButton(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

const OverflowBox = styled.div`
  border: solid 1px #808080;
  width: 85%;
  height: 300px;
  padding: 0.5em;
  margin: 0.5em 0;
  overflow: auto;
`;

const Playlist: React.FC<IProps> = props => {
  const playlistElements = props.playlists.map(playlist => {
    return (
      <PlaylistItem playlist={playlist} handleClick={props.handleClick} key={playlist.type + playlist.playlistId} />
    );
  });

  return (
    <div>
      <OverflowBox>{playlistElements}</OverflowBox>
      <button onClick={props.handleExecButton}>転送開始</button>
    </div>
  );
};

export default Playlist;
