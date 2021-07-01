import React, { useEffect, useState } from "react";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Badge } from "react-bootstrap";

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
import "../map/index.css";

import { leaderboard } from "./leaderboard";

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
          console.log(res.data.data);
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
  let colors = ["red", "green", "blue", "yellow", "orange", "violet"];
  return (
    <>
      <Navbar bg="dark" expand="lg" fixed="top" variant="dark" lazyAutoToggle>
        <Navbar.Brand href="#cover">GTD</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#leaderboard">
            <Button variant="outline-secondary">Leaderboard</Button>
          </Nav.Link>
        </Nav>
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
      <Cont id="cover">
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
              <Button as={Link} to="/viewer" variant="outline-primary">
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
      <Cont id="leaderboard">
        <Card>
          <Table striped responsive="sm">
            <thead>
              <tr>
                <th>No.</th>
                <th>User</th>
                {colors.map((colors) => {
                  return (
                    <th>
                      <Badge className={colors}>{colors}</Badge>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((leaderboard) => {
                return (
                  <tr>
                    <td>{leaderboard.id}</td>
                    <td>{leaderboard.user}</td>
                    {colors.map((colors) => {
                      let i = 0;
                      if (i < leaderboard.completedTiles.length) {
                        if (leaderboard.completedTiles.includes(colors)) {
                          return (
                            <td>
                              <i class="fas fa-check"></i>
                            </td>
                          );
                        } else {
                          return (
                            <td>
                              <i class="fas fa-times"></i>
                            </td>
                          );
                        }
                      }
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      </Cont>
      <Switch>
        <Route exact path="/login"></Route>
        <Route exact path="/map"></Route>
        <Route exact path="/viewer"></Route>
      </Switch>
    </>
  );
}
