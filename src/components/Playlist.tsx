import React, { useState, useEffect } from "react";
import PlaylistItem from "./PlaylistItem";
import IPlaylist from "../interfaces/IPlaylist";
import "../core/ICore";

// interface IProps {
//   playlists: IPlaylist[];
// }

const Playlist: React.FC = () => {
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);

  const event = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault;
    console.log("my name is pikachu");
  };

  useEffect(() => {
    window.core.getPlaylists().then(result => {
      setPlaylists(result);
    });
  }, []);

  const playlistElements = playlists.map(playlist => {
    return <PlaylistItem name={playlist.name} key={playlist.type + playlist.playlistId} />;
  });

  return (
    <div>
      <div>{playlistElements}</div>
      <button onClick={event}>転送開始</button>
    </div>
  );
};

export default Playlist;
