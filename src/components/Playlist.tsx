import React from "react";
import styled, { keyframes } from "styled-components";
import { Segment, Button, Icon, Label } from "semantic-ui-react";
import PlaylistItem from "./PlaylistItem";
import IPlaylist from "../interfaces/IPlaylist";

interface IProps {
  playlists: IPlaylist[];
  tracksCount: number;
  allFileSize: number;
  handleCheckBox(e: React.MouseEvent<HTMLInputElement>): void;
  handleExecButton(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  syncing: boolean;
  message: string;
}

const PlaylistBox = styled.div`
  margin: 1em 0;
`;

const syncGradation = keyframes`
  &&& {
    0% {
      background-position: 90% 0%;
    }
    50% {
      background-position: 10% 100%;
    }
    100% {
      background-position: 90% 0%;
    }
  }
`;

const SyncSegment = styled(Segment)`
  &&& {
    padding: 7px;
    background: linear-gradient(#1ec0ff, #1ea0ff);
    &:hover {
      background: linear-gradient(#1ed0ff, #1eb0ff);
      cursor: pointer;
    }
  }
`;

const DisabledSyncSegment = styled(Segment)`
  &&& {
    padding: 7px;
    background: linear-gradient(225deg, #1ed0ff, #1ea0ff);
    background-size: 400% 400%;
    background-position: 50% 50%;
    animation: ${syncGradation} 2.5s ease 100;
  }
`;

const MessageBox = styled(Segment)`
  &&& {
    padding: 7px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Playlist: React.FC<IProps> = props => {
  const playlistElements = props.playlists.map(playlist => {
    return (
      <PlaylistItem
        playlist={playlist}
        handleCheckBox={props.handleCheckBox}
        key={playlist.type + playlist.playlistId}
      />
    );
  });

  return (
    <PlaylistBox>
      <Segment.Group style={{ margin: "0" }}>
        <Segment textAlign={"left"} style={{ overflow: "auto", height: "310px" }}>
          {playlistElements}
        </Segment>
        <MessageBox size={"small"}>
          {/* {props.tracksCount} songs - {formatBytes(props.allFileSize)} */}
          {props.message}
        </MessageBox>
        {/* <SyncButton syncing={props.syncing} handleExecButton={props.handleExecButton} /> */}
        {(() => {
          if (props.syncing) {
            return (
              <DisabledSyncSegment size={"small"}>
                <Icon name={"sync alternate"} />
                syncing...
              </DisabledSyncSegment>
            );
          } else {
            return (
              <SyncSegment size={"small"} onClick={props.handleExecButton}>
                <Icon name={"sync alternate"} />
                sync
              </SyncSegment>
            );
          }
        })()}
      </Segment.Group>
    </PlaylistBox>
  );
};

export default Playlist;
