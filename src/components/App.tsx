import React, { useState, useEffect } from "react";
import Playlist from "./Playlist";
import MessageBox from "./MessageBox";
import LogBox from "./LogBox";
import IPlaylist from "../interfaces/IPlaylist";

const App: React.FC = () => {
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);

  useEffect(() => {
    window.core.getPlaylists().then(result => {
      setPlaylists(result);
    });
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const key = e.currentTarget.dataset.key;

    const updated = playlists.map(playlist => {
      if (playlist.type + playlist.playlistId === key) {
        return { ...playlist, checked: !playlist.checked };
      }
      return playlist;
    });
    setPlaylists(updated);
  };

  return (
    <div>
      <Playlist playlists={playlists} handleClick={handleClick} />
      <MessageBox message="******" />
      <LogBox log="**********" />
    </div>
  );
};

export default App;
