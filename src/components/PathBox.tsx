import React from "react";
import styled from "styled-components";
import { Input, Label, Form } from "semantic-ui-react";

interface IProps {
  basePath: string;
  handlePathBox: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PathBox: React.FC<IProps> = props => {
  return (
    <Form.Field>
      <Input
        icon={"mobile alternate"}
        iconPosition={"left"}
        placeholder={"Input your portable device path"}
        value={props.basePath}
        onChange={props.handlePathBox}
        style={{ width: "100%" }}
      />
    </Form.Field>
  );
};

export default PathBox;
