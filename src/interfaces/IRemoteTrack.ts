interface IRemoteTrack {
  trackId: number;
  path: string;
  skip: boolean;
  artist?: string;
  title?: string;
}

export default IRemoteTrack;
