import React from "react";

import { Cont } from "./Style";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";

import axios from "axios";

export function Winner(props) {
  const ans = React.createRef();

  const submit = () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { "auth-token": token },
    };
    if (token) {
      axios
        .post(
          "map/final",
          {
            answer: ans.current.value,
          },
          config
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          props.setFailShow(true);
          props.setChangeColor({
            status: false,
            error: err.response.data.message,
          });
        });
    }
  };

  return (
    <Cont>
      <div style={{ height: "4vh", fontWeight: "bold" }}>FINAL QUESTION!!</div>
      <div style={{ height: "5vh" }}>Question</div>
      <Form>
        <Form.Group>
          <Form.Control
            placeholder="Answer"
            aria-describedby="basic-addon1"
            ref={ans}
          ></Form.Control>
        </Form.Group>
      </Form>
      <Button onClick={submit}>Submit</Button>
    </Cont>
  );
}
