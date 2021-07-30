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
import { Loading } from "../../utils/loading";

export default function Page(props) {
  const socket = useContext(SocketContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState({ name: "" });
  const [leaderboard, setLeaderboard] = useState({
    "admin-og-1": { name: "admin-og-1", completedColor: [], winTime: "" },
    "admin-og-2": { name: "admin-og-2", completedColor: [], winTime: "" },
    "admin-og-3": { name: "admin-og-3", completedColor: [], winTime: "" },
    "admin-og-4": { name: "admin-og-4", completedColor: [], winTime: "" },
    "admin-og-5": { name: "admin-og-5", completedColor: [], winTime: "" },
    "admin-og-6": { name: "admin-og-6", completedColor: [], winTime: "" },
    "admin-og-7": { name: "admin-og-7", completedColor: [], winTime: "" },
    "admin-og-8": { name: "admin-og-8", completedColor: [], winTime: "" },
  });
  const names = [
    "admin-og-1",
    "admin-og-2",
    "admin-og-3",
    "admin-og-4",
    "admin-og-5",
    "admin-og-6",
    "admin-og-7",
    "admin-og-8",
  ];
  const colors = ["red", "green", "blue", "orange", "violet"];
  useEffect(() => {
    setIsLoading(true);
    socket.on("leaderboardUpdate", (newData) => {
      let data = {
        "admin-og-1": { name: "admin-og-1", completedColor: [], winTime: "" },
        "admin-og-2": { name: "admin-og-2", completedColor: [], winTime: "" },
        "admin-og-3": { name: "admin-og-3", completedColor: [], winTime: "" },
        "admin-og-4": { name: "admin-og-4", completedColor: [], winTime: "" },
        "admin-og-5": { name: "admin-og-5", completedColor: [], winTime: "" },
        "admin-og-6": { name: "admin-og-6", completedColor: [], winTime: "" },
        "admin-og-7": { name: "admin-og-7", completedColor: [], winTime: "" },
        "admin-og-8": { name: "admin-og-8", completedColor: [], winTime: "" },
      };
      console.log(newData.data);
      for (let i = 0; i < newData.data.length; i += 1) {
        data[newData.data[i].name].completedColor =
          newData.data[i].completedColor;
        data[newData.data[i].name].winTime = newData.data[i].winTime;
      }
      setLeaderboard(data);
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
      setIsLoading(false);
      let data = {
        "admin-og-1": { name: "admin-og-1", completedColor: [], winTime: "" },
        "admin-og-2": { name: "admin-og-2", completedColor: [], winTime: "" },
        "admin-og-3": { name: "admin-og-3", completedColor: [], winTime: "" },
        "admin-og-4": { name: "admin-og-4", completedColor: [], winTime: "" },
        "admin-og-5": { name: "admin-og-5", completedColor: [], winTime: "" },
        "admin-og-6": { name: "admin-og-6", completedColor: [], winTime: "" },
        "admin-og-7": { name: "admin-og-7", completedColor: [], winTime: "" },
        "admin-og-8": { name: "admin-og-8", completedColor: [], winTime: "" },
      };
      for (let i = 0; i < res.data.data.length; i += 1) {
        data[res.data.data[i].name].completedColor =
          res.data.data[i].completedColor;
        data[res.data.data[i].name].winTime = res.data.data[i].winTime;
      }
      setLeaderboard(data);
      console.log(res.data.data);
    });
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
            <Text>For manpower, please click Developer.</Text>
            <Text style={{ textDecoration: "underline" }}>
              Scroll down to see the leaderboard!
            </Text>
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
                <th>Win Time</th>
              </tr>
            </thead>
            <tbody>
              {names.map((names) => {
                return (
                  <tr>
                    <td>{leaderboard[names].name}</td>
                    {colors.map((colors) => {
                      if (leaderboard[names].completedColor.includes(colors)) {
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
                    <td>{leaderboard[names].winTime}</td>
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
      <Loading open={isLoading}></Loading>
    </>
  );
}
