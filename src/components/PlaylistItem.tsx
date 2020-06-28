import React from "react";
import styled from "styled-components";
import { List, Checkbox } from "semantic-ui-react";
import IPlaylist from "../interfaces/IPlaylist";

interface IProps {
  playlist: IPlaylist;
  handleClick(e: React.MouseEvent<HTMLInputElement>): void;
}

const FlexListContent = styled(List.Content)`
  display: flex;
  justify-content: space-between;
`;

const TrackCount = styled.span`
  color: #b8cacc;
  font-size: small;
`;

const PlaylistItem: React.FC<IProps> = props => {
  const playlist = props.playlist;

  return (
    <div>
      <List>
        <List.Item style={{ margin: "0.5em" }}>
          <FlexListContent data-key={playlist.type + playlist.playlistId} onClick={props.handleClick}>
            <Checkbox label={playlist.name} checked={playlist.checked} onChange={() => console.log("clicked")} />
            <TrackCount>{playlist.trackCount} songs</TrackCount>
          </FlexListContent>
        </List.Item>
      </List>
    </div>
  );
};

export default PlaylistItem;
