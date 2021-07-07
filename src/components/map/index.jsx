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

import { Switch, Route, Link } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

import "bootstrap/dist/css/bootstrap.min.css";

const socket = io("http://localhost:4000", { transports: ["websocket"] });

/* the Map function contains the layout of the hexagons, 
  individual hexagons are built from sample.json data which 
  follows the following schema: 
  {
    "q":0,
    "r":0,
    "s":0,
    "color":"red"
    "type":"qna",
    "owner":"admin-og-1",
    "question":"bayi makan apa?",
    "answer":"makan makanan",
  },
*/

// Create Styling Hexagon based of type and owner
function StyledHex(props) {
  const { type, owner, color, className } = props;
  return <Hexagon {...props} />;
}

function SuccessModal(props) {
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
  if (props.message === "Answer is not correct") {
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
  } else if (props.message === "Tile is already completed") {
    return (
      <Modal
        show={props.show}
        onHide={props.onHide}
        aria-labelledby="container-modal-title-vcenter"
        centered
      >
        <ModalHeader closeButton>
          <ModalTitle>You have selected that tile before!</ModalTitle>
        </ModalHeader>
        <ModalFooter>
          <Button onClick={props.onHide}>Close</Button>
        </ModalFooter>
      </Modal>
    );
  } else if (props.message === "color chosen doesn't match") {
    return (
      <Modal
        show={props.show}
        onHide={props.onHide}
        aria-labelledby="container-modal-title-vcenter"
        centered
      >
        <ModalHeader closeButton>
          <ModalTitle>Please choose the highlighted tile!</ModalTitle>
        </ModalHeader>
        <ModalFooter>
          <Button onClick={props.onHide}>Close</Button>
        </ModalFooter>
      </Modal>
    );
  } else if (props.message === "Still on progress") {
    return (
      <Modal
        show={props.show}
        onHide={props.onHide}
        aria-labelledby="container-modal-title-vcenter"
        centered
      >
        <ModalHeader closeButton>
          <ModalTitle>
            You have selected a tile! <br></br>Do finish it first to proceed!
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
          <ModalTitle>Random error</ModalTitle>
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
    "admin-og-3": 2,
    "admin-og-4": 3,
    "admin-og-5": 4,
    "admin-og-6": 5,
    "admin-og-7": 6,
    "admin-og-8": 7,
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
  const [changeColor, setChangeColor] = useState({ status: true, error: "" }); // to check whether answer is right or wrong. If wrong, then dont randomize for next color
  const [adjacent, setAdjacent] = useState("none"); // state to save adjacent tile colors
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

  const [successShow, setSuccessShow] = useState(false); //use to pop up Success Modal
  const successClose = () => setSuccessShow(false); //to close the Success Modal

  const [failShow, setFailShow] = useState(false); //use to pop up Fail Modal
  const failClose = () => setFailShow(false); //use to close Fail Modal

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
            if (hex.color.length < 7) {
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

    let ans = descTile.question ? answer.current.value : ""; // to check if there is question, it will be current anwser, else empty string
    let adjcolors = []; // to store colors that is adjacent to current tile
    let adjcoords = []; // to store coordinates that is adjacent to current tile

    for (let i = 0; i < hexagons.length; i += 1) {
      if (
        HexUtils.distance(hexagons[i], descTile) === 1 &&
        hexagons[i].color !== String(user.name)
      ) {
        adjcolors.push(hexagons[i].color);
        adjcoords.push({
          q: hexagons[i].q,
          r: hexagons[i].r,
          s: hexagons[i].s,
          color: hexagons[i].color,
        });
      }
    }
    adjcolors = [...new Set(adjcolors)];
    let item;
    if (changeColor.status) {
      item = adjcolors[Math.floor(Math.random() * adjcolors.length)];
      setAdjacent(String(item)); //randomized adjacent color
    }
    item = item ? String(item) : adjacent; // if not able to change color (due to wrong answer), item will be assigned as adjacent

    adjcoords = adjcoords.filter((adj) => adj.color === item); // filter coordinates that has the same color as adjacent

    if (token) {
      axios
        .all([
          axios.get("user/", config),
          axios.put(
            "map/move",
            {
              name: user.name,
              answer: ans,
              nextColor: String(item),
              q: descTile.q,
              r: descTile.r,
              s: descTile.s,
              newTileColor: descTile.color,
              adjacentCoord: adjcoords,
            },
            config
          ),
        ])
        .then(
          axios.spread((login, map) => {
            setUser(login.data.data);
            const coloredHexas = hexagons
              ? hexagons.map((hex) => {
                  if (HexUtils.equals(descTile, hex)) {
                    hex.color = user.name;
                  } else if (
                    HexUtils.distance(descTile, hex) === 1 &&
                    hex.color !== user.name &&
                    hex.color === String(item)
                  ) {
                    if (hex.color.length < 7) {
                      hex.color += " active";
                    }
                  }
                  return hex;
                })
              : GridGenerator.hexagon(3);
            setHexagons(coloredHexas);
            const data = {
              user: login.data.data.name,
              grid: coloredHexas,
              color: descTile.color,
            };
            socket.emit("hexagon", data);
            setSuccessShow(false);
            setChangeColor({ status: true, error: "" });
          })
        )
        .catch((err) => {
          setChangeColor({ status: false, error: err.response.data.message });
          setFailShow(true);
        });
    }
  }
  //a function to pass all the props and change every state
  function selectedHex(event, source, owner, type, color, question, answer) {
    const token = localStorage.getItem("token");
    const config = {
      headers: { "auth-token": token },
    };
    axios
      .post(
        "map/move",
        {
          name: user.name,
          newTileColor: color + " active",
          q: source.state.hex.q,
          r: source.state.hex.r,
          s: source.state.hex.s,
        },
        config
      )
      .then((res) => {
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
        setSuccessShow(true);
      })
      .catch((err) => {
        setChangeColor({ status: true, error: err.response.data.message });
        setFailShow(true);
      });
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
          message={changeColor.error}
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
