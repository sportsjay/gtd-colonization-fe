import React, { useState } from "react";
import { Container, Text, LoginCard } from "./Style";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import axios from "axios";
import { Switch, Route, Link, useHistory } from "react-router-dom";

export default function Page(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();

  const username = React.createRef();

  const password = React.createRef();

  function handleKeyPress(target) {
    if (target.charCode === 13) {
      submit();
    }
  }

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
        setShow(true);
      });
  }
  if (loggedIn) {
    history.goBack();
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
                onKeyPress={handleKeyPress}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Type real name"
                aria-label="Password"
                aria-describedby="basic-addon1"
                ref={password}
                onKeyPress={handleKeyPress}
              ></Form.Control>
            </Form.Group>
          </Form>
          <Button onClick={submit}>Login</Button>
        </LoginCard>
      </Container>
      <Switch>
        <Route exact path="/home"></Route>
      </Switch>
      <FailLogin show={show} onHide={handleClose}></FailLogin>
    </>
  );
}

function FailLogin(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <Modal.Title>Wrong Username or Password!</Modal.Title>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
