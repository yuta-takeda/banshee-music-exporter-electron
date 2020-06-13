import React from "react";

interface IProps {
  message: string;
}

const MessageBox: React.FC<IProps> = props => {
  return <div>{props.message}</div>;
};

export default MessageBox;
