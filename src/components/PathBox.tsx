import React from "react";

interface IProps {
  basePath: string;
  handlePathBox: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PathBox: React.FC<IProps> = props => {
  return (
    <div>
      <label>ポータブルオーディオパス</label>
      <input type="text" value={props.basePath} onChange={props.handlePathBox} />
    </div>
  );
};

export default PathBox;
