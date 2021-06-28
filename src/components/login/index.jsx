import React, { useState } from "react";
import { Container, Text, LoginCard } from "./Style";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import axios from "axios";
import { Switch, Route, Link, Redirect } from "react-router-dom";

export default function Page(props) {
  const [loggedIn, setLoggedIn] = useState(false);

  const username = React.createRef();

  const password = React.createRef();

  function submit() {
    axios
      .post("user/login", {
        name: username.current.value,
        password: password.current.value,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.data.token);
        setLoggedIn(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  if (loggedIn) {
    return <Redirect to={"/"}></Redirect>;
  }
  return (
    <>
      <Container>
        <LoginCard>
          <Link to="/">
            <Text>GTD</Text>
          </Link>
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
      <Switch>
        <Route exact path="/home"></Route>
      </Switch>
    </>
  );
}
