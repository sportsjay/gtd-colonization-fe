import React, { useState, useEffect } from "react";

import {
  HexGrid,
  Layout,
  Hexagon,
  HexUtils,
  GridGenerator,
} from "react-hexgrid";

import ModalHeader from "react-bootstrap/esm/ModalHeader";
import {
  Modal,
  ModalFooter,
  ModalTitle,
  Container,
  Col,
  Row,
  Nav,
} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import "./index.css";

import { Switch, Route, Link, Redirect } from "react-router-dom";
import axios from "axios";

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
  // return (
  //   <Modal
  //     show={props.show}
  //     onHide={props.onHide}
  //     aria-labelledby="contained-modal-title-vcenter"
  //     centered
  //   >
  //     <ModalHeader closeButton>
  //       <ModalTitle>
  //         Zonk/Challenge coordinate = {props.descTile.q} {props.descTile.r}{" "}
  //         {props.descTile.s}
  //       </ModalTitle>
  //     </ModalHeader>
  //     <ModalFooter>
  //       <Button variant="primary" onClick={props.clickHex}>
  //         Confirm
  //       </Button>
  //     </ModalFooter>
  //   </Modal>
  // );
  if (props.descTile.type === "qna") {
    return (
      <Modal
        show={props.show}
        onHide={props.onHide}
        aria-labelledby="container-modal-title-vcenter"
        centered
      >
        <ModalHeader closeButton>
          <ModalTitle>{props.descTile.question}</ModalTitle>
        </ModalHeader>
        <ModalFooter>
          <Form>
            <Form.Group>
              <Form.Control
                placeholder="Answer"
                aria-describedby="basic-addon1"
                ref={props.answer}
              ></Form.Control>
            </Form.Group>
            <Button onClick={props.clickHex}>Submit</Button>
          </Form>
        </ModalFooter>
      </Modal>
    );
  } else {
    return (
      <Modal
        show={props.show}
        onHide={props.onHide}
        aria-labelledby="contained-modal-title-vcenter"
        centered
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
}

function FailModal(props) {
  if (props.answer === "wrong") {
    return (
      <Modal
        show={props.show}
        onHide={props.onHide}
        aria-labelledby="container-modal-title-vcenter"
        centered
      >
        <ModalTitle>Wrong Answer!</ModalTitle>
        <ModalFooter>
          <Button onClick={props.onHide}>Close</Button>
        </ModalFooter>
      </Modal>
    );
  } else if (props.status) {
    return (
      <Modal
        show={props.show}
        onHide={props.onHide}
        aria-labelledby="container-modal-title-vcenter"
        centered
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
        centered
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

function LoginModal(props) {
  return (
    <Modal show={props.show} backdrop="static">
      <ModalHeader>
        <ModalTitle>You are not logged in!</ModalTitle>
      </ModalHeader>
      <ModalFooter>
        <Button as={Link} to="/">
          Home
        </Button>
        <Button as={Link} to="/viewer">
          View
        </Button>
        <Button as={Link} to="/login">
          Login
        </Button>
      </ModalFooter>
    </Modal>
  );
}

function Map(props) {
  // const hexagons = GridGenerator.rectangle(30, 30);
  // Initialize States
  const [hexagons, setHexagons] = useState(); // hexagons is the local state which refers to the json data as initial data
  let users = {
    "admin-og-1": 0,
    "admin-og-2": 1,
  };
  const [user, setUser] = useState({
    name: "",
    // nextTileColor: {
    //   //store the next tile color that has been randomized
    //   type: String,
    //   default: "none",
    // },
    // completedColor: {
    //   //keep track of unique color of all tiles completed
    //   type: Array,
    //   default: [],
    // },
    // completedTiles: {
    //   //keep track of all tiles completed
    //   type: Array,
    //   default: [],
    // },
    onProgress: {
      //checking if it's on progress in a tile
      // type: Boolean,
      // required: true,
      // default: false,
      currentTile: {
        q: null,
        r: null,
        s: null,
      },
      status: false,
    },
  });
  // winTime: {
  //   type: String,
  //   default: "none",
  // }); // to change users
  const [adjacent, setAdjacent] = useState(
    //"red green yellow blue violet orange"
    "none"
  ); // state to save adjacent tile colors
  const color = adjacent.includes("none") ? "Select a tile first!" : adjacent;
  const [descTile, setDescTile] = useState({
    q: -3,
    r: -3,
    s: 6,
    owner: "none",
    type: "none",
    color: "none",
    question: "none",
    answer: "none",
  });

  const answer = React.createRef();

  const [isNotLogged, setIsNotLogged] = useState(false); // to check whether logged in or not
  const token = localStorage.getItem("token");

  const [successShow, setSuccessShow] = useState(false); //use to pop up base Modal
  const successClose = () => setSuccessShow(false); //to close the base Modal

  const [failShow, setFailShow] = useState(false);
  const failClose = () => setFailShow(false);

  // to check login credentials
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // const decoded = jwt_decode(token);
      const config = {
        headers: { "auth-token": token },
      };
      axios.all([axios.get("user/", config), axios.get("map/")]).then(
        axios.spread((login, map) => {
          setIsNotLogged(false);
          setUser(login.data.data);
          // console.log(login.data.data);
          setHexagons(map.data.data[users[login.data.data.name]].tiles);
          setAdjacent(login.data.data.nextTileColor);
        })
      );
    } else {
      setIsNotLogged(true);
    }
  }, []);

  // to highlight the tile selected
  useEffect(() => {
    const coloredHexas = hexagons
      ? hexagons.map((hex) => {
          if (HexUtils.distance(hex, user.onProgress.currentTile) === 1) {
            hex.color = hex.color.replace(" active", "");
          }
          if (HexUtils.equals(hex, descTile)) {
            if (hex.color.includes(" active") === false) {
              hex.color += " active";
            }
          } else {
            if (hex.color === String(user.name)) {
              hex.color = String(user.name);
            }
          }
          return hex;
        })
      : GridGenerator.hexagon(3);
    setHexagons(coloredHexas);
  }, [descTile]);
  // function to handle on click
  // use this function if success
  function clickHex() {
    const token = localStorage.getItem("token");
    const config = {
      headers: { "auth-token": token },
    };
    if (token) {
      axios.get("user/", config).then((res) => {
        setUser(res.data.data);
      });
    }
    // click validation based on tile ownership
    let ans = descTile.question ? answer.current.value : "";
    let completed = "";
    let adjcolors = [];

    for (let i = 0; i < hexagons.length; i += 1) {
      if (
        HexUtils.distance(hexagons[i], descTile) === 1 &&
        hexagons[i].color !== String(user.name)
      ) {
        adjcolors.push(hexagons[i].color);
      }
    }
    adjcolors = [...new Set(adjcolors)];
    let item = adjcolors[Math.floor(Math.random() * adjcolors.length)];
    setAdjacent(String(item));

    if (
      (user.completedTiles.length > 0 &&
        HexUtils.distance(descTile, user.onProgress.currentTile) === 1) ||
      user.completedTiles.length === 0
    ) {
      const coloredHexas = hexagons
        ? hexagons.map((hex) => {
            if (HexUtils.equals(descTile, hex)) {
              completed += hex.color;
              completed = completed.replace(" active", "");
              hex.color = user.name;
            } else if (
              HexUtils.distance(descTile, hex) === 1 &&
              hex.color !== user.name &&
              hex.color === String(item)
            ) {
              if (hex.color.includes(" active") === false) {
                hex.color += " active";
              }
            }
            return hex;
          })
        : GridGenerator.hexagon(3);
      setHexagons(coloredHexas);
      if (token) {
        axios
          .put(
            "map/move",
            {
              name: user.name,
              answer: ans,
              nextColor: String(item),
              q: descTile.q,
              r: descTile.r,
              s: descTile.s,
              newTileColor: user.name,
              leaderboard: completed,
            },
            config
          )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            setFailShow(true);
            setSuccessShow(false);
          });
      }
    } else {
      setFailShow(true);
    }
    setSuccessShow(false);
  }
  //a function to pass all the props and change every state
  function selectedHex(event, source, owner, type, color, question, answer) {
    const token = localStorage.getItem("token");
    const config = {
      headers: { "auth-token": token },
    };
    console.log(user);
    let boolean;
    let colour = color.replace(" active", "");
    if (adjacent.includes("none")) {
      boolean = true;
    } else if (adjacent.length > color.length) {
      boolean = adjacent.includes(colour);
    } else {
      boolean = colour.includes(adjacent);
    }

    if (color === String(user.name) || !boolean) {
      console.log("wow");
      setFailShow(true);
    } else {
      if (user.onProgress.status) {
        if (HexUtils.equals(source.state.hex, descTile)) {
          console.log("here");
          setSuccessShow(true);
        } else {
          console.log("wow1");
          setFailShow(true);
        }
      } else {
        if (user.onProgress.currentTile.q === null) {
          console.log("there");
          setDescTile({
            q: source.state.hex.q,
            r: source.state.hex.r,
            s: source.state.hex.s,
            owner: owner,
            type: type,
            color: color,
            question: question,
            answer: answer,
          });
          const token = localStorage.getItem("token");
          if (token) {
            const config = {
              headers: { "auth-token": token },
            };
            axios
              .post(
                "map/move",
                {
                  name: user.name,
                  nextTileColor: adjacent,
                  q: source.state.hex.q,
                  r: source.state.hex.r,
                  s: source.state.hex.s,
                  newTileColor: color + " active",
                },
                config
              )
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                setFailShow(true);
                setSuccessShow(false);
              });
          }
          setSuccessShow(true);
        } else if (
          HexUtils.distance(source.state.hex, user.onProgress.currentTile) === 1
        ) {
          console.log("everywhere");
          setDescTile({
            q: source.state.hex.q,
            r: source.state.hex.r,
            s: source.state.hex.s,
            owner: owner,
            type: type,
            color: color,
            question: question,
            answer: answer,
          });
          if (token) {
            axios
              .post(
                "map/move",
                {
                  name: user.name,
                  nextTileColor: adjacent,
                  q: source.state.hex.q,
                  r: source.state.hex.r,
                  s: source.state.hex.s,
                  newTileColor: color + " active",
                },
                config
              )
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log("error ye");
                setFailShow(true);
                setSuccessShow(false);
              });
          }
          setSuccessShow(true);
        } else {
          console.log(
            HexUtils.distance(source.state.hex, user.onProgress.currentTile)
          );
          setFailShow(true);
        }
      }
    }
  }

  return (
    <>
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
                  <Badge pill className={color} style={{ marginLeft: "-15px" }}>
                    {color}
                  </Badge>
                </Col>
              </Row>
            </Container>
          </Navbar.Text>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/">
                <Button variant="outline-secondary">Home</Button>
              </Nav.Link>
              <Nav.Link as={Link} to="/viewer">
                <Button variant="outline-secondary">View</Button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Switch>
          <Route exact path="/login"></Route>
          <Route exact path="/home"></Route>
          <Route exact path="/viewer"></Route>
        </Switch>
        <HexGrid width={"100vw"} height={"100vh"}>
          <Layout
            size={{ x: 6, y: 6 }}
            flat={false}
            spacing={1.02}
            origin={{ x: 0, y: 0 }}
          >
            {hexagons ? (
              hexagons.map((hex, i) => {
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
                      selectedHex(
                        _,
                        hexCoord,
                        hex.owner,
                        hex.type,
                        hex.color,
                        hex.question,
                        hex.answer
                      )
                    }
                  ></StyledHex>
                );
              })
            ) : (
              <p>Not loaded!</p>
            )}
          </Layout>
        </HexGrid>
        <SuccessModal
          show={successShow}
          onHide={successClose}
          clickHex={clickHex}
          descTile={descTile}
          answer={answer}
        ></SuccessModal>
        <FailModal
          show={failShow}
          onHide={failClose}
          status={user.onProgress.status}
        ></FailModal>
        <LoginModal show={isNotLogged}></LoginModal>
      </div>
      {/* <div className="d-flex flex-wrap justify-content-center align-items-center h-50">
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
      </div> */}
    </>
  );
}

export default Map;
