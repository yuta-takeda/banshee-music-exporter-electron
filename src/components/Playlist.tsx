import React from "react";
import PlaylistItem from "./PlaylistItem";
import IPlaylist from "../interfaces/IPlaylist";
import "../core/ICore";

interface IProps {
  playlists: IPlaylist[];
  handleClick(e: React.MouseEvent<HTMLInputElement>): void;
  handleExecButton(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

const Playlist: React.FC<IProps> = props => {
  const playlistElements = props.playlists.map(playlist => {
    return (
      <PlaylistItem playlist={playlist} handleClick={props.handleClick} key={playlist.type + playlist.playlistId} />
    );
  });

  return (
    <div>
      <div>{playlistElements}</div>
      <button onClick={props.handleExecButton}>転送開始</button>
    </div>
  );
};

export default Playlist;
