import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Button } from "react-bootstrap";

// import routes
import { routes } from "./router";

// import socket
import { SocketContext, socket } from "./utils/socket";
import { useEffect } from "react";

function PrivateRoute(props) {
  const token = localStorage.getItem("token");
  return token ? <Route {...props} /> : <Redirect to="/login" />;
}

function Navigation(props) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    console.log("re-render please");
  }, [localStorage.getItem("token")]);

  const handleClick = () => {
    localStorage.setItem("token", "");
    window.location.reload();
  };

  return (
    <Navbar bg="dark" expand="lg" fixed="top" variant="dark">
      <Navbar.Brand as={Link} to="/">
        GTD
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          {routes.map((route) => {
            // exclude login
            if (route.name === "login") return <></>;
            return (
              <Nav.Link as={Link} to={route.path}>
                <Button variant="outline-secondary">{route.name}</Button>
              </Nav.Link>
            );
          })}
        </Nav>
        <Nav className="ml-auto">
          {token ? (
            <Nav.Link as={Link} to="/viewer" onClick={handleClick}>
              <Button variant="outline-secondary">Logout</Button>
            </Nav.Link>
          ) : (
            <Nav.Link as={Link} to="/login">
              <Button variant="outline-secondary">Login</Button>
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    console.log("main app refresh");
  }, [localStorage.getItem("token")]);

  return (
    <div className="App">
      <SocketContext.Provider value={socket}>
        <Router>
          <Navigation />
          <Switch>
            {routes.map((route) =>
              !route.isPrivate ? (
                <Route
                  exact
                  path={route.path}
                  component={route.component}
                  key={route.id}
                />
              ) : (
                <PrivateRoute
                  exact
                  path={route.path}
                  component={route.component}
                  key={route.id}
                />
              )
            )}
          </Switch>
        </Router>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
