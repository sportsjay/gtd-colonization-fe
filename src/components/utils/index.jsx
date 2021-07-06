import React, { useEffect, useState } from "react";

import { HexGrid, Layout, Hexagon } from "react-hexgrid";

// import { layout } from "./layout.js";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { Switch, Route, Link } from "react-router-dom";

import axios from "axios";
import io from "socket.io-client";

import "./index.css";

//const socket = io("http://localhost:4000");

// this page is for queue and shop
export default function Page(props) {
  function StyledHex(props) {
    const { type, owner, color, className } = props;
    return <Hexagon {...props} />;
  }
  const [data, setData] = useState({
    "admin-og-1": [],
    "admin-og-2": [],
    "admin-og-3": [],
    "admin-og-4": [],
    "admin-og-5": [],
    "admin-og-6": [],
    "admin-og-7": [],
    "admin-og-8": [],
  });

  const [isLogged, setIsLogged] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [descTile, setDescTile] = useState();

  const og = [
    "admin-og-1",
    "admin-og-2",
    "admin-og-3",
    "admin-og-4",
    "admin-og-5",
    "admin-og-6",
    "admin-og-7",
    "admin-og-8",
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("map/").then((res) => {
      setData(res.data.data[0].Map);
    });
    if (token) {
      const config = {
        headers: { "auth-token": token },
      };
      axios
        .get("user/", config)
        .then((res) => {
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

  function selectedHex(layout) {
    setDescTile(layout);
    setShow(true);
  }
  function Zoom(props) {
    return (
      <Modal
        show={props.show}
        onHide={props.onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body
          className="d-flex justify-content-center bg-dark align-items-center flex-column"
          style={{ height: "50vh" }}
        >
          {descTile ? (
            <HexGrid width="75vw" height="75vh">
              <Layout
                size={{ x: 7, y: 7 }}
                flat={false}
                spacing={1.02}
                origin={{ x: 0, y: 0 }}
              >
                {descTile.map((hex, i) => {
                  return (
                    <StyledHex
                      key={i}
                      q={hex.q}
                      r={hex.r}
                      s={hex.s}
                      owner={hex.owner}
                      type={hex.type}
                      color={hex.color}
                      className={hex.color}
                    ></StyledHex>
                  );
                })}
              </Layout>
            </HexGrid>
          ) : (
            <p>Nothing here!</p>
          )}
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <>
      <Navbar bg="dark" expand="lg" fixed="top" variant="dark">
        <Navbar.Brand as={Link} to="/">
          GTD
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">
              <Button variant="outline-secondary">Home</Button>
            </Nav.Link>
            <Nav.Link as={Link} to="/map">
              <Button variant="outline-secondary">Map</Button>
            </Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            {isLogged ? (
              <Nav.Link as={Link} to="/utils" onClick={handleClick}>
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
      <Switch>
        <Route exact path="/login"></Route>
        <Route exact path="/map"></Route>
        <Route exact path="/"></Route>
      </Switch>
      <div
        className="d-flex flex-wrap justify-content-center align-items-center h-100"
        style={{ marginTop: "80px" }}
      >
        {data
          ? og.map((layout) => {
              return (
                <div
                  className="flex-column text-center"
                  onClick={() => selectedHex(data[layout])}
                >
                  <p style={{ marginBottom: "-6vh" }}>Group {layout}</p>
                  <HexGrid width="50vw" height="50vh">
                    <Layout
                      size={{ x: 7, y: 7 }}
                      flat={false}
                      spacing={1.02}
                      origin={{ x: 0, y: 0 }}
                    >
                      {data[layout].map((hex, i) => {
                        return (
                          <StyledHex
                            key={i}
                            q={hex.q}
                            r={hex.r}
                            s={hex.s}
                            owner={hex.owner}
                            type={hex.type}
                            color={hex.color}
                            className={hex.color}
                          ></StyledHex>
                        );
                      })}
                    </Layout>
                  </HexGrid>
                </div>
              );
            })
          : console.log("nothing")}
      </div>
      <Zoom show={show} onHide={handleClose}></Zoom>
    </>
  );
}
