import React, { useState, useEffect } from "react";
import { HexGrid, Layout, Hexagon, HexUtils } from "react-hexgrid";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import {
  Modal,
  ModalFooter,
  ModalTitle,
  Container,
  Col,
  Row,
} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Badge from "react-bootstrap/Badge";
import "./index.css";

import { data } from "./sample.json";
// import { data1 } from "./1.json";
// import { data2 } from "./2.json";
// import { data3 } from "./3.json";
// import { data4 } from "./4.json";
// import { data5 } from "./5.json";
// import { data6 } from "./6.json";
// import { data7 } from "./7.json";
import { layout } from "./layout.js";
import "bootstrap/dist/css/bootstrap.min.css";

/* the Map function contains the layout of the hexagons, 
  individual hexagons are built from sample.json data which 
  follows the following schema: 
  {
    "q":0,
    "r":0,
    "s":0,
    "color":"red"
    "type":"zonk",
    "owner":"group1",
    "props":{
      "className":""
    }
  },
*/
// Create Styling Hexagon based of type and owner
function StyledHex(props) {
  const { type, owner, color, className } = props;
  return <Hexagon {...props} />;
}

function SuccessModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <ModalHeader closeButton>
        <ModalTitle>
          Zonk/Challenge coordinate = {props.descTile.q} {props.descTile.r}{" "}
          {props.descTile.s}
        </ModalTitle>
      </ModalHeader>
      <ModalFooter>
        <Button variant="primary" onClick={props.clickHex}>
          Confirm
        </Button>
      </ModalFooter>
    </Modal>
  );
}

function FailModal(props) {
  if (props.onModal) {
    return (
      <Modal
        show={props.show}
        onHide={props.onHide}
        aria-labelledby="container-modal-title-vcenter"
      >
        <ModalHeader closeButton>
          <ModalTitle>
            You have selected a tile! Do finish it first to proceed!
          </ModalTitle>
        </ModalHeader>
        <ModalFooter>
          <Button onClick={props.onHide}>Close</Button>
        </ModalFooter>
      </Modal>
    );
  } else {
    return (
      <Modal
        show={props.show}
        onHide={props.onHide}
        aria-labelledby="container-modal-title-vcenter"
      >
        <ModalHeader closeButton>
          <ModalTitle>
            It is not adjacent to your current tile or You have selected that
            tile before!
          </ModalTitle>
        </ModalHeader>
        <ModalFooter>
          <Button onClick={props.onHide}>Close</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

function Map(props) {
  // const hexagons = GridGenerator.rectangle(30, 30);
  // Initialize States
  const [hexagons, setHexagons] = useState(data); // hexagons is the local state which refers to the json data as initial data
  const [user, setUser] = useState("group1"); // test user state only
  //const [selectedTile, setSelectedTile] = useState({ q: -3, r: -3, s: 6 }); // state to save the coordinates after selecting
  const [previousTile, setPreviousTile] = useState({ q: -3, r: -3, s: 6 }); // state to save the coordinates of previous tiles
  const [adjacent, setAdjacent] = useState(
    "red green yellow blue violet orange"
  ); // state to save adjacent tile colors
  const color = adjacent.length > 6 ? "Select a tile first!" : adjacent;
  //const [ownerTile, setOwnerTile] = useState({ owner: "none" }); // state to save the owner variable after selecting
  //const [typeTile, setTypeTile] = useState({ type: "none" }); // state to save the type variable after selecting
  //const [colorTile, setColorTile] = useState({ color: "none" }); // state to save the color variable after selecting
  const [onModal, setOnModal] = useState(false); // state to check whether he selected a hex or not
  const [started, setStarted] = useState(false); // state to check whether a starting point has been selected or not
  const [descTile, setDescTile] = useState({
    q: -3,
    r: -3,
    s: 6,
    owner: "none",
    type: "none",
    color: "none",
  });
  // const [active, setActive] = useState(true); //active or deactive the highlight
  // const [ownedTiles, setOwnedTiles] = useState(
  //   data.filter((hex) => hex.type === "claimed")
  // ); // state to know every data that is claimed

  // const [neighbourTiles, setNeighbourTiles] = useState(
  //   ownedTiles.map((hex) =>
  //     data.filter(
  //       (hexv2) =>
  //         HexUtils.distance(hex, hexv2) === 1 && hexv2.type !== "claimed"
  //     )
  //   )
  // );
  // const neighbours = [];
  // for (let i = 0; i < neighbourTiles.length; i++) {
  //   for (let j = 0; j < neighbourTiles[i].length; j++) {
  //     neighbours.push({
  //       q: neighbourTiles[i][j].q,
  //       r: neighbourTiles[i][j].r,
  //       s: neighbourTiles[i][j].s,
  //       type: neighbourTiles[i][j].type,
  //       owner: neighbourTiles[i][j].owner,
  //       props: neighbourTiles[i][j].props,
  //     });
  //   }
  // }
  // const set = new Set();
  // for (let i = 0; i < neighbours.length; i++) {
  //   set.add(JSON.stringify(neighbours[i]));
  // }

  const [successShow, setSuccessShow] = useState(false); //use to pop up base Modal
  const successClose = () => setSuccessShow(false); //to close the base Modal

  const [failShow, setFailShow] = useState(false);
  const failClose = () => setFailShow(false);

  // to highlight the tile selected
  useEffect(() => {
    const coloredHexas = hexagons.map((hex) => {
      if (HexUtils.distance(hex, previousTile) === 1) {
        hex.color = hex.color.replace(" active", "");
      }
      if (HexUtils.equals(hex, descTile)) {
        hex.color += " active";
      } else {
        if (hex.color === String(user)) {
          hex.color = String(user);
        }
      }
      return hex;
    });
    setHexagons(coloredHexas);
  }, [descTile]);

  // useEffect(() => {
  //   console.log(adjacent);
  // }, [adjacent]);

  // function to handle on click
  // use this function if success
  function clickHex() {
    // click validation based on tile ownership
    // setActive(false);
    // let x = 0;
    // to check if its distance is adjacent to the claimed tiles
    // for (let i = 0; i < ownedTiles.length; i++) {
    //   if (HexUtils.distance(targetHex, ownedTiles[i]) === 1) {
    //     x = 1;
    //     break;
    //   }
    // }
    // if (owner === user && x === 1 && type !== "claimed") {
    //   const coloredHexas = hexagons.map((hex) => {
    //     // Highlight tiles that are next to the target (1 distance away)
    //     if (HexUtils.distance(targetHex, hex) === 0) {
    //       if (hex.props.className.includes("active")) {
    //         hex.props.className = String(owner);
    //       } else {
    //         hex.props.className += String(owner);
    //       }
    //     }
    //     if (HexUtils.distance(targetHex, hex) === 1) {
    //       if (
    //         hex.props.className.includes("active") ||
    //         hex.props.className.includes(String(owner))
    //       ) {
    //         console.log("here!");
    //       } else {
    //         hex.props.className += "active";
    //       }
    //     }
    //     if (set.has(JSON.stringify(hex))) {
    //       if (
    //         hex.props.className.includes("active") ||
    //         hex.props.className.includes(String(owner))
    //       ) {
    //         console.log("here!");
    //       } else {
    //         hex.props.className += "active";
    //       }
    //     }
    //     // Highlight clicked tile
    //     return hex;
    //   });
    //   setHexagons(coloredHexas);
    // } else {
    //   setFailShow(true);
    // }
    let adjcolors = [];

    let x = 0;
    for (let i = 0; i < hexagons.length; i += 1) {
      if (hexagons[i].color === String(descTile.owner)) {
        x = 1;
        break;
      }
    }

    for (let i = 0; i < hexagons.length; i += 1) {
      if (
        HexUtils.distance(hexagons[i], descTile) === 1 &&
        hexagons[i].color !== String(user)
      ) {
        adjcolors.push(hexagons[i].color);
      }
    }
    adjcolors = [...new Set(adjcolors)];
    let item = adjcolors[Math.floor(Math.random() * adjcolors.length)];
    setAdjacent(String(item));

    if (descTile.owner === user) {
      if (
        (x === 1 && HexUtils.distance(descTile, previousTile) === 1) ||
        x === 0
      ) {
        setPreviousTile({ q: descTile.q, r: descTile.r, s: descTile.s });
        const coloredHexas = hexagons.map((hex) => {
          if (HexUtils.equals(descTile, hex)) {
            hex.color = String(descTile.owner);
          } else if (
            HexUtils.distance(descTile, hex) === 1 &&
            hex.color !== String(descTile.owner) &&
            hex.color === String(item)
          ) {
            hex.color += " active";
          }
          return hex;
        });
        setHexagons(coloredHexas);
      } else {
        setFailShow(true);
      }
    } else {
      setFailShow(true);
    }
    setSuccessShow(false);
    setOnModal(false);
  }

  //a function to pass all the props and change every state
  function selectedHex(event, source, owner, type, color) {
    let boolean;
    let colour = color.replace(" active", "");
    if (adjacent.length > color.length) {
      boolean = adjacent.includes(colour);
    } else {
      boolean = colour.includes(adjacent);
    }
    if (color === String(user) || !boolean) {
      console.log(color === String(user), boolean);
      setFailShow(true);
    } else {
      if (onModal) {
        if (HexUtils.equals(source.state.hex, descTile)) {
          setSuccessShow(true);
        } else {
          setFailShow(true);
        }
      } else {
        setOnModal(true);
        // setSuccessShow(true);
        if (!started) {
          setPreviousTile(source.state.hex);
          setDescTile({
            q: source.state.hex.q,
            r: source.state.hex.r,
            s: source.state.hex.s,
            owner: owner,
            type: type,
            color: color,
          });
          setStarted(true);
          setSuccessShow(true);
        } else if (HexUtils.distance(source.state.hex, previousTile) === 1) {
          setDescTile({
            q: source.state.hex.q,
            r: source.state.hex.r,
            s: source.state.hex.s,
            owner: owner,
            type: type,
            color: color,
          });
          setSuccessShow(true);
        } else {
          setOnModal(false);
          setFailShow(true);
        }
        //setOwnerTile(owner);
        //setTypeTile(type);
        //setColorTile(color);
        //setSelectedTile(source.state.hex)
      }
    }
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
        integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
        crossorigin="anonymous"
      />
      <div className="d-flex" style={{ height: "100vh" }}>
        <Navbar
          expand="lg"
          bg="dark"
          variant="dark"
          fixed="top"
          className="justify-content-between"
        >
          <Navbar.Brand>GTD</Navbar.Brand>
          <Navbar.Text>
            <Container>
              <Row>
                <Col xs={20}>
                  <Badge>Your next color is:</Badge>
                </Col>
                <Col>
                  <Badge pill className={color} style={{ marginLeft: "-20px" }}>
                    {color}
                  </Badge>
                </Col>
              </Row>
            </Container>
          </Navbar.Text>
        </Navbar>
        <HexGrid width={"100vw"} height={"100vh"}>
          <Layout
            size={{ x: 6, y: 6 }}
            flat={false}
            spacing={1.02}
            origin={{ x: 0, y: 0 }}
          >
            {/* {hexagons.map((hex, i) => {
              const state = active ? "active" : hex.props.className;
              return hex.type === "claimed" ? (
                <StyledHex
                  key={i}
                  q={hex.q}
                  r={hex.r}
                  s={hex.s}
                  owner={hex.owner}
                  type={hex.type}
                  className={hex.owner}
                  onClick={(_, hexCoord) =>
                    selectedHex(_, hexCoord, hex.owner, hex.type)
                  }
                />
              ) : set.has(JSON.stringify(hex)) ? (
                <StyledHex
                  key={i}
                  q={hex.q}
                  r={hex.r}
                  s={hex.s}
                  owner={hex.owner}
                  type={hex.type}
                  className={state}
                  onClick={(_, hexCoord) =>
                    selectedHex(_, hexCoord, hex.owner, hex.type)
                  }
                />
              ) : (
                <StyledHex
                  key={i}
                  q={hex.q}
                  r={hex.r}
                  s={hex.s}
                  owner={hex.owner}
                  type={hex.type}
                  className={hex.props.className}
                  onClick={(_, hexCoord) =>
                    selectedHex(_, hexCoord, hex.owner, hex.type)
                  }
                />
              );
            })} */}
            {hexagons.map((hex, i) => {
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
                  onClick={(_, hexCoord) =>
                    selectedHex(_, hexCoord, hex.owner, hex.type, hex.color)
                  }
                ></StyledHex>
              );
            })}
          </Layout>
        </HexGrid>
        <SuccessModal
          show={successShow}
          onHide={successClose}
          //selectedTile={selectedTile}
          previousTile={previousTile}
          clickHex={clickHex}
          //ownerTile={ownerTile}
          //typeTile={typeTile}
          //colorTile={colorTile}
          descTile={descTile}
        ></SuccessModal>
        <FailModal
          show={failShow}
          onHide={failClose}
          onModal={onModal}
        ></FailModal>
      </div>
      <div className="d-flex flex-wrap justify-content-center align-items-center h-50">
        {layout.map((layout) => {
          return (
            <div className="flex-column text-center">
              <p style={{ marginBottom: "-40px" }}>Group {layout.id}</p>
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
    </>
  );
}

export default Map;
