import React, { useEffect, useState } from "react";

import { HexGrid, Layout, Hexagon } from "react-hexgrid";

import { layout } from "./layout.js";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { Switch, Route, Link } from "react-router-dom";

import axios from "axios";

import "./index.css";

// this page is for queue and shop
export default function Page(props) {
  function StyledHex(props) {
    const { type, owner, color, className } = props;
    return <Hexagon {...props} />;
  }

  const [isLogged, setIsLogged] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [descTile, setDescTile] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
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
          {props.description ? (
            <HexGrid width="75vw" height="75vh">
              <Layout
                size={props.description.size}
                flat={false}
                spacing={1.02}
                origin={props.description.origin}
              >
                {props.description.data.map((hex, i) => {
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
        {layout.map((layout) => {
          return (
            <div
              className="flex-column text-center"
              onClick={() => selectedHex(layout)}
            >
              <p style={{ marginBottom: "-6vh" }}>Group {layout.id}</p>
              <HexGrid width={layout.width} height={layout.height}>
                <Layout
                  size={layout.size}
                  flat={false}
                  spacing={1.02}
                  origin={layout.origin}
                >
                  {layout.data.map((hex, i) => {
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
        })}
      </div>
      <Zoom show={show} description={descTile} onHide={handleClose}></Zoom>
    </>
  );
}
