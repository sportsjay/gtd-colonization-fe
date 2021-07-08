import React, { useEffect, useState, useContext } from "react";
import { Badge, Button, Table } from "react-bootstrap";
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

import axios from "axios";
import { SocketContext } from "../../utils/socket";

// const socket = io("http://localhost:4000", { transports: ["websocket"] });

export default function Page(props) {
  const socket = useContext(SocketContext);

  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState({ name: "" });
  const [leaderboard, setLeaderboard] = useState([
    { name: "", completedColor: [] },
    { name: "", completedColor: [] },
    { name: "", completedColor: [] },
    { name: "", completedColor: [] },
    { name: "", completedColor: [] },
    { name: "", completedColor: [] },
    { name: "", completedColor: [] },
    { name: "", completedColor: [] },
  ]);
  const colors = ["red", "green", "blue", "yellow", "orange", "violet"];
  useEffect(() => {
    socket.on("leaderboardUpdate", (newData) => {
      setLeaderboard(newData.data);
    });
    const token = localStorage.getItem("token");
    if (token) {
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
    axios.get("user/getuserprogress").then((res) => {
      console.log(res.data.data);
      setLeaderboard(res.data.data);
    });
    let users = {
      "admin-og-1": 0,
      "admin-og-2": 1,
      "admin-og-3": 2,
      "admin-og-4": 3,
      "admin-og-5": 4,
      "admin-og-6": 5,
      "admin-og-7": 6,
      "admin-og-8": 7,
    };
  }, [socket]);

  return (
    <>
      {/* <Navbar bg="dark" expand="lg" fixed="top" variant="dark" lazyAutoToggle>
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
      </Navbar> */}
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
              {leaderboard ? (
                leaderboard.map((leaderboard) => {
                  return (
                    <tr>
                      <td>{leaderboard.name}</td>
                      {colors.map((colors) => {
                        if (leaderboard.completedColor.includes(colors)) {
                          return (
                            <td>
                              <i class="fas fa-check" />
                            </td>
                          );
                        } else {
                          return (
                            <td>
                              <i class="fas fa-times" />
                            </td>
                          );
                        }
                      })}
                    </tr>
                  );
                })
              ) : (
                <p>Nothing here!</p>
              )}
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
