import React, { useEffect } from "react";

interface IProps {
  log: string[];
}

const LogBox: React.FC<IProps> = props => {
  useEffect(() => {
    console.log(props.log);
  }, [props.log]);

  return (
    <div>
      <textarea readOnly={true} rows={5} value={props.log.join("\n")} />
    </div>
  );
};

export default LogBox;
