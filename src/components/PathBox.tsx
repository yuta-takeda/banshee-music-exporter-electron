import React from "react";
import styled from "styled-components";
import { Input, Label, Form } from "semantic-ui-react";

interface IProps {
  basePath: string;
  handlePathBox: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ColorLabel = styled(Label)`
  background: #e6fdff !important;
  border: 1px solid #1ed0df;
`;

const PathBox: React.FC<IProps> = props => {
  return (
    <Form.Field>
      <Input
        icon={"mobile alternate"}
        iconPosition={"left"}
        placeholder={"ポータブルデバイスのパスを入力してください"}
        value={props.basePath}
        onChange={props.handlePathBox}
        style={{ width: "100%" }}
      />
    </Form.Field>
  );
};

export default PathBox;
