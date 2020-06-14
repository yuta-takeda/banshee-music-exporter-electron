import React from "react";

interface IProps {
  tracksCount: number;
  allFileSize: number;
}

const MessageBox: React.FC<IProps> = props => {
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div>
      <p>転送楽曲数：{props.tracksCount}</p>
      <p>ファイルサイズ：{formatBytes(props.allFileSize)}</p>
    </div>
  );
};

export default MessageBox;
