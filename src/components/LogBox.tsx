import React from "react";

interface IProps {
  log: string;
}

const LogBox: React.FC<IProps> = props => {
  return (
    <div>
      <textarea readOnly={true} rows={5} value={props.log} />
    </div>
  );
};

export default LogBox;
