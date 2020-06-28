import React, { useEffect } from "react";
import styled from "styled-components";

interface IProps {
  log: string[];
}

const LogLine = styled.p`
  margin: 0;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LogBox: React.FC<IProps> = props => {
  useEffect(() => {
    const logBox = document.getElementById("logBox");
    if (logBox) {
      logBox.scrollTop = logBox.scrollHeight;
    }
  }, [props.log]);

  const LogMsg = props.log.map((msg, idx) => {
    return <LogLine key={idx}>{msg}</LogLine>;
  });

  return (
    <div id={"logBox"} style={{ overflow: "auto", width: "100%", height: "100px" }}>
      {LogMsg}
    </div>
  );
};

export default LogBox;
