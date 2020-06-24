import React from "react";
import { Input, Label, Form } from "semantic-ui-react";

interface IProps {
  basePath: string;
  handlePathBox: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PathBox: React.FC<IProps> = props => {
  return (
    <Form.Field>
      <Label pointing="below" style={{ width: "75%" }}>
        ポータブルオーディオパスを入力
      </Label>
      <Input value={props.basePath} onChange={props.handlePathBox} style={{ width: "100%" }} />
    </Form.Field>
  );
};

export default PathBox;
