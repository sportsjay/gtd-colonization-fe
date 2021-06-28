import React, { useEffect, useState } from "react";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

import { Switch, Route, Link } from "react-router-dom";

import {
  Cont,
  Card,
  Title,
  SubCard,
  SubSubCard,
  Text,
  TextCard,
} from "./Style";

import jwt_decode from "jwt-decode";
import axios from "axios";

export default function Page(props) {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState({ name: "" });
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      const config = {
        headers: { "auth-token": token },
      };
      axios
        .get("user/", config)
        .then((res) => {
          setUser({ name: res.data.data.name });
          setIsLogged(true);
        })
        .catch((err) => console.error(err));
    } else {
      setIsLogged(false);
    }
  }, []);
  const handleClick = () => {
    localStorage.clear();
    window.location.reload();
  };
  return (
    <>
      <Navbar bg="dark" expand="lg" fixed="top" variant="dark">
        <Navbar.Brand as={Link} to="/">
          GTD
        </Navbar.Brand>
        <Nav className="ml-auto">
          {isLogged ? (
            <Nav.Link as={Link} to="/">
              <Button variant="outline-secondary" onClick={handleClick}>
                Logout
              </Button>
            </Nav.Link>
          ) : (
            <Nav.Link as={Link} to="/login">
              <Button variant="outline-secondary">Login</Button>
            </Nav.Link>
          )}
        </Nav>
      </Navbar>
      <Cont>
        <Card>
          {isLogged ? (
            <Title>Welcome, {user.name}</Title>
          ) : (
            <Title>You are not logged in!</Title>
          )}
          <TextCard>
            <Text>For freshies, please click Viewer.</Text>
            <Text>For MCs, please click Developer.</Text>
          </TextCard>
          <SubCard>
            <SubSubCard>
              <Title>Viewer</Title>
              <Button as={Link} to="/utils" variant="outline-primary">
                View
              </Button>
            </SubSubCard>
            <SubSubCard>
              <Title>Developer</Title>
              <Button as={Link} to="/map" variant="outline-primary">
                Map
              </Button>
            </SubSubCard>
          </SubCard>
        </Card>
      </Cont>
      <Switch>
        <Route exact path="/login"></Route>
        <Route exact path="/map"></Route>
        <Route exact path="/utils"></Route>
      </Switch>
    </>
  );
}
