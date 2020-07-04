import React from "react";
import styled from "styled-components";
import { Segment } from "semantic-ui-react";
import Playlist from "./Playlist";
import PathBox from "./PathBox";
import IPlaylist from "../interfaces/IPlaylist";

interface AppProps {
  basePath: string;
  playlists: IPlaylist[];
  tracksCount: number;
  allFileSize: number;
  syncing: boolean;
  message: string;
  handlePathBox(e: React.ChangeEvent<HTMLInputElement>): void;
  handleCheckBox(e: React.MouseEvent<HTMLInputElement>): void;
  handleExecButton(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

const BaseSegment = styled(Segment)`
  background: #e6e6e6 !important;
  height: 100%;
`;

const AppComponent: React.FC<AppProps> = props => {
  return (
    <BaseSegment basic textAlign={"center"}>
      <PathBox basePath={props.basePath} handlePathBox={props.handlePathBox} />
      <Playlist
        playlists={props.playlists}
        handleCheckBox={props.handleCheckBox}
        handleExecButton={props.handleExecButton}
        tracksCount={props.tracksCount}
        allFileSize={props.allFileSize}
        syncing={props.syncing}
        message={props.message}
      />
    </BaseSegment>
  );
};

export default AppComponent;
