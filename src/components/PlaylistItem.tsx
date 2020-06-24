import React from "react";
import { List, Checkbox } from "semantic-ui-react";
import IPlaylist from "../interfaces/IPlaylist";

interface IProps {
  playlist: IPlaylist;
  handleClick(e: React.MouseEvent<HTMLInputElement>): void;
}

const PlaylistItem: React.FC<IProps> = props => {
  const playlist = props.playlist;

  return (
    <div>
      <List>
        <List.Item style={{ margin: "0.5em" }}>
          <List.Content data-key={playlist.type + playlist.playlistId} onClick={props.handleClick}>
            <Checkbox label={playlist.name} checked={playlist.checked} onChange={() => console.log("clicked")} />
          </List.Content>
        </List.Item>
      </List>
    </div>
  );
};

export default PlaylistItem;
