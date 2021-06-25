import React, { useState } from "react";
import { Container, Text, LoginCard } from "./Style";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import axios from "axios";

export default function Page(props) {
  const username = React.createRef();

  const password = React.createRef();

  function submit() {
    axios
      .post("http://localhost:4000/user/login", {
        name: username.current.value,
        password: password.current.value,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        console.log(res.data.token);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <Container>
      <LoginCard>
        <Text>GTD</Text>
        <Form>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              placeholder="Type real name"
              aria-label="Username"
              aria-describedby="basic-addon1"
              ref={username}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Type real name"
              aria-label="Username"
              aria-describedby="basic-addon1"
              ref={password}
            ></Form.Control>
          </Form.Group>
        </Form>
        <Button onClick={submit}>Login</Button>
      </LoginCard>
    </Container>
  );
}
