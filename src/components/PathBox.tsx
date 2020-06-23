import React from "react";
import "semantic-ui-css/semantic.min.css";
import { Input, Label, Form } from "semantic-ui-react";

interface IProps {
  basePath: string;
  handlePathBox: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PathBox: React.FC<IProps> = props => {
  return (
    <Form.Field>
      <Label pointing="below">ポータブルオーディオパスを入力</Label>
      <Input value={props.basePath} onChange={props.handlePathBox} />
    </Form.Field>
  );
};

export default PathBox;
