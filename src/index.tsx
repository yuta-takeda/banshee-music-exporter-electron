import React from "react";
import ReactDOM from "react-dom";
import Playlist from "./components/Playlist";
import MessageBox from "./components/MessageBox";
import LogBox from "./components/LogBox";
import IPlaylist from "./interfaces/IPlaylist";
import "./core/ICore";

const container = document.getElementById("contents");

// const playlists: IPlaylist[] = [
//   { name: "#RatingCopy", playlistId: 1, checked: false },
//   { name: "コンポーネント", playlistId: 3, checked: true },
// ];

ReactDOM.render(
  <div>
    <Playlist />
    <MessageBox message="******" />
    <LogBox log="************" />
  </div>,
  container,
);
