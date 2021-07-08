import React, { useEffect, useState, useContext } from "react";
import { HexGrid, Layout, Hexagon } from "react-hexgrid";
import { Modal, Button } from "react-bootstrap";

import axios from "axios";
import { SocketContext } from "../../utils/socket";

import "./index.css";

function StyledHex(props) {
  return <Hexagon {...props} />;
}

// Viewers
export default function ViewerPage(props) {
  const socket = useContext(SocketContext);
  const [maps, setMaps] = useState([
    { tiles: [], name: "" },
    { tiles: [], name: "" },
    { tiles: [], name: "" },
    { tiles: [], name: "" },
    { tiles: [], name: "" },
    { tiles: [], name: "" },
    { tiles: [], name: "" },
    { tiles: [], name: "" },
  ]);

  const [isLogged, setIsLogged] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [descTile, setDescTile] = useState();

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

  useEffect(() => {
    socket.on("mapUpdate", (newData) => {
      const _maps = newData.data;
      console.log(_maps);
      // data[users[newData.user]].tiles = newData.grid;
      setMaps(_maps);
    });
    const token = localStorage.getItem("token");
    console.log(token);
    const config = {
      headers: { "auth-token": token },
    };
    axios.get("map/").then((res) => {
      setMaps(res.data.data);
    });
    if (token) {
      axios.get("user/", config).then((res) => {
        setIsLogged(true);
      });
    } else {
      setIsLogged(false);
    }
  }, [socket]);

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
      <div
        className="d-flex flex-wrap justify-content-center align-items-center h-100"
        style={{ marginTop: "80px" }}
      >
        {maps
          ? maps.map((layout) => {
              return (
                <div
                  className="flex-column text-center"
                  onClick={() => selectedHex(layout.tiles)}
                >
                  <p style={{ marginBottom: "-6vh" }}>Group {layout.name}</p>
                  <HexGrid width="50vw" height="50vh">
                    <Layout
                      size={{ x: 7, y: 7 }}
                      flat={false}
                      spacing={1.02}
                      origin={{ x: 0, y: 0 }}
                    >
                      {layout.tiles.map((hex, i) => {
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
                          />
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
