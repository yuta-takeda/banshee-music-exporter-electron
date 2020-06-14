import React from "react";
import IPlaylist from "../interfaces/IPlaylist";

interface IProps {
  playlist: IPlaylist;
  handleClick(e: React.MouseEvent<HTMLInputElement>): void;
}

const PlaylistItem: React.FC<IProps> = props => {
  const playlist = props.playlist;

  return (
    <div>
      <p data-key={playlist.type + playlist.playlistId} onClick={props.handleClick}>
        <input type="checkbox" checked={playlist.checked} onChange={() => console.log("clicked")} />
        <span>{playlist.name}</span>
      </p>
    </div>
  );
};

export default PlaylistItem;
