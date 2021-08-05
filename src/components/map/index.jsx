import React, { useState, useEffect, useContext } from "react";

import {
  HexGrid,
  Layout,
  Hexagon,
  HexUtils,
  GridGenerator,
  Text,
} from "react-hexgrid";

import ModalHeader from "react-bootstrap/esm/ModalHeader";
import {
  Modal,
  ModalFooter,
  ModalTitle,
  ModalBody,
  Button,
  Form,
  Row,
  Badge,
} from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import { Winner } from "./winner";

import "./index.css";
import { Loading } from "../../utils/loading";

import { Link } from "react-router-dom";
import axios from "axios";
import { SocketContext } from "../../utils/socket";

import "bootstrap/dist/css/bootstrap.min.css";

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
  return <Hexagon {...props} />;
}

function SuccessModal(props) {
  const title = {
    station: "Station",
    question: "Question",
    challenge: "Challenge",
  };
  if (props.descTile.type === "question") {
    return (
      <Modal
        show={props.show}
        onHide={props.onHide}
        aria-labelledby="container-modal-title-vcenter"
        centered
        size="lg"
      >
        <ModalHeader closeButton>
          <ModalTitle>{title[props.descTile.type]}</ModalTitle>
        </ModalHeader>
        <ModalBody>{props.descTile.question}</ModalBody>
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
  } else if (props.descTile.type === "station") {
    // const links = {
    //   green: "https://drive.google.com/uc?id=1r7pGYPVvZ2A-s4d8hRP6MN3b0_6XmkL2",
    //   red: "https://drive.google.com/uc?id=1OgNU7gLpqC6ftYhcF9jApzjDhkrBUJNI",
    //   violet:
    //     "Beast of new and old are gathered. Hollow with only their traces left to tell the tale",
    //   orange:
    //     "https://drive.google.com/uc?id=1s-FK4Jhj56Rnx2gKSqytOHl_cew0ggLy",
    //   blue: "https://drive.google.com/uc?id=1oMGbNZmb72yNADCNFXeeyNGo5gnSOjG_",
    // };
    const color = props.descTile.color.replace(" active", "");
    return (
      <Modal
        show={props.show}
        onHide={props.onHide}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <ModalHeader closeButton>
          <ModalTitle>{title[props.descTile.type]}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          {color === "violet" ? (
            props.descTile.question
          ) : (
            <a target="_blank" href={props.descTile.question}>
              <img
                src={props.descTile.question}
                alt="Click this link!"
                style={{ width: 470 }}
              ></img>
            </a>
          )}
        </ModalBody>
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
        size="lg"
      >
        <ModalHeader closeButton>
          <ModalTitle>{title[props.descTile.type]}</ModalTitle>
        </ModalHeader>
        <ModalBody>{props.descTile.question}</ModalBody>
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
  const messageHandler = {
    "Answer is not correct": "Wrong Answer!",
    "Tile is already completed": "You have selected that tile before!",
    "color chosen doesn't match": "Please choose the highlighted tile!",
    "Still on progress":
      "You have selected a tile! Do finish it first to proceed!",
    "have won the game": "You have won the game!",
  };
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      aria-labelledby="container-modal-title-vcenter"
      centered
    >
      <ModalHeader closeButton>
        <ModalTitle>
          {messageHandler[props.message] || "Please choose highlighted tile!"}
        </ModalTitle>
      </ModalHeader>
      <ModalFooter>
        <Button onClick={props.onHide}>Close</Button>
      </ModalFooter>
    </Modal>
  );
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

function AnswerModal(props) {
  console.log(props.popup);
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      aria-labelledby="container-modal-title-vcenter"
      centered
    >
      <ModalHeader closeButton>
        <ModalTitle>Correct!!</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <img src={props.popup} style={{ width: 470 }}></img>
      </ModalBody>
      <ModalFooter>
        <Button onClick={props.onHide}>Close</Button>
      </ModalFooter>
    </Modal>
  );
}

function Map(props) {
  const socket = useContext(SocketContext);
  // const hexagons = GridGenerator.rectangle(30, 30);
  // Initialize States
  const [hexagons, setHexagons] = useState(); // hexagons is the local state which refers to the json data as initial data
  const [user, setUser] = useState({
    name: "",
    haveAdjTile: false,
    // nextTileColor: {
    //   //store the next tile color that has been randomized
    //   type: String,
    //   default: "none",
    // },
    completedColor: [],
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
  const [isLoading, setIsLoading] = useState(false);
  const [changeColor, setChangeColor] = useState({ status: true, error: "" }); // to determine what kind of error
  const [freeMode, setFreeMode] = useState({ free: false, time: false });
  const [putted, setPutted] = useState(false); // for tile before confirmed still set to active and not "latest"
  const [finished, setFinished] = useState(false);

  const [descTile, setDescTile] = useState({
    q: -3,
    r: -3,
    s: 6,
    owner: "none",
    type: "none",
    color: "none",
    question: "none",
    answer: "none",
    popup: "none",
  });

  const answer = React.createRef();

  const [isNotLogged, setIsNotLogged] = useState(false); // to check whether logged in or not

  const [answerShow, setAnswerShow] = useState(false); // to pop up station modal after answer correctly
  const answerClose = () => {
    setAnswerShow(false);
  };

  const [successShow, setSuccessShow] = useState(false); //use to pop up Success Modal
  const successClose = () => setSuccessShow(false); //to close the Success Modal

  const [failShow, setFailShow] = useState(false); //use to pop up Fail Modal
  const failClose = () => setFailShow(false); //use to close Fail Modal

  // to check login credentials
  useEffect(() => {
    setIsLoading(true);
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
          for (let i = 0; i < map.data.data.length; i += 1) {
            if (map.data.data[i].name === login.data.data.name) {
              setHexagons(map.data.data[i].tiles);
              break;
            }
          }
          setIsLoading(false);
          if (freeMode.time === false) {
            if (login.data.data.haveAdjTile === false) {
              setFreeMode({ free: true, time: false });
            } else {
              setFreeMode({ free: false, time: false });
            }
          }
          if (login.data.data.onProgress.status === false) {
            setPutted(true);
          }
          if (login.data.data.completedColor.length === 5) {
            setFinished(true);
            setPutted(false);
          }
        })
      );
    } else {
      setIsNotLogged(true);
    }
    // to highlight the tile selected
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
    setIsLoading(false);
  }, [socket, descTile]);

  // function to handle on click
  // use this function if success
  function clickHex() {
    setIsLoading(true);
    setSuccessShow(false);
    const token = localStorage.getItem("token");
    const config = {
      headers: { "auth-token": token },
    };
    const color = descTile.color.replace(" active", "");
    let ans = descTile.answer ? answer.current.value : ""; // to check if there is question, it will be current anwser, else empty string
    let adjcoords = []; // to store coordinates that is adjacent to current tile

    for (let i = 0; i < hexagons.length; i += 1) {
      if (
        HexUtils.distance(hexagons[i], descTile) === 1 &&
        hexagons[i].color !== String(user.name) &&
        hexagons[i].type !== "zonk"
      ) {
        adjcoords.push({
          q: hexagons[i].q,
          r: hexagons[i].r,
          s: hexagons[i].s,
          color: hexagons[i].color,
        });
      }
    }

    if (token) {
      axios
        .all([
          axios.get("user/", config),
          axios.put(
            "map/move",
            {
              name: user.name,
              answer: ans,
              q: descTile.q,
              r: descTile.r,
              s: descTile.s,
              type: descTile.type,
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
                    hex.color !== user.name
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
            if (freeMode.time === false) {
              if (adjcoords.length > 0) {
                setFreeMode({ free: false, time: false });
              } else {
                setFreeMode({ free: true, time: false });
              }
            }
            setChangeColor({ status: true, error: "" });
            setIsLoading(false);
            setAnswerShow(true);
            if (
              user.completedColor.length >= 4 &&
              descTile.type === "station" &&
              user.completedColor.includes(color) === false
            ) {
              setFinished(true);
            } else {
              setPutted(true);
            }
          })
        )
        .catch((err) => {
          setIsLoading(false);
          setChangeColor({ status: false, error: err.response.data.message });
          setSuccessShow(true);
          setFailShow(true);
        });
    }
  }
  //a function to pass all the props and change every state
  function selectedHex(
    event,
    source,
    owner,
    type,
    color,
    question,
    answer,
    popup
  ) {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const config = {
      headers: { "auth-token": token },
    };

    if (
      (HexUtils.distance(source.state.hex, user.onProgress.currentTile) === 1 &&
        color !== user.name) ||
      user.onProgress.currentTile.q === null ||
      (HexUtils.equals(source.state.hex, user.onProgress.currentTile) &&
        color !== user.name) ||
      freeMode.free
    ) {
      axios
        .post(
          "map/move",
          {
            name: user.name,
            newTileColor: color.includes(" active") ? color : color + " active",
            q: source.state.hex.q,
            r: source.state.hex.r,
            s: source.state.hex.s,
          },
          config
        )
        .then((res) => {
          setPutted(false);
          setDescTile({
            q: source.state.hex.q,
            r: source.state.hex.r,
            s: source.state.hex.s,
            owner: owner,
            type: type,
            color: color,
            question: question,
            answer: answer,
            popup: popup,
          });
          setSuccessShow(true);
        })
        .catch((err) => {
          setChangeColor({ status: true, error: err.response.data.message });
          setFailShow(true);
          setIsLoading(false);
        });
    } else {
      setFailShow(true);
      setIsLoading(false);
    }
  }

  function timeLimit() {
    setFreeMode({ time: true, free: true });
  }

  return (
    <React.Fragment>
      <>
        <div
          style={{
            display: "flex",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <img
            src="https://drive.google.com/uc?id=1TMI0J1RWkiSu337WTA7GgAyFvnTcnnKr"
            className="backgroundimg"
          ></img>
          <header
            style={{
              marginTop: 80,
              marginBottom: -80,
              width: "100%",
              // background: "",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Row>
              {freeMode.time ? (
                <Badge bg="primary">
                  Hurry, Click on any tile!! Don't mind the highlighted
                  hexagons!
                </Badge>
              ) : freeMode.free && !finished ? (
                <Badge>Click any tile!</Badge>
              ) : (
                <Badge></Badge>
              )}
            </Row>
          </header>
          {finished ? (
            <Winner
              setFailShow={setFailShow}
              setChangeColor={setChangeColor}
              user={user}
            ></Winner>
          ) : (
            <Navbar className="justify-content-end" fixed="bottom">
              <Nav>
                <Nav.Link onClick={timeLimit}>
                  <i class="fas fa-clock"></i>
                </Nav.Link>
              </Nav>
            </Navbar>
          )}
          <HexGrid width={"100vw"} height={"100vh"}>
            <Layout
              size={{ x: 6, y: 6 }}
              flat={false}
              spacing={1.02}
              origin={{ x: 0, y: 0 }}
            >
              {hexagons ? (
                hexagons.map((hex, i) => {
                  const diff =
                    hex.type === "station"
                      ? "S"
                      : hex.type === "question"
                      ? "Q"
                      : hex.type === "challenge"
                      ? "C"
                      : "";
                  return hex.type === "zonk" ? (
                    <StyledHex
                      q={hex.q}
                      r={hex.r}
                      s={hex.s}
                      className="zonk"
                    ></StyledHex>
                  ) : HexUtils.equals(hex, user.onProgress.currentTile) &&
                    putted ? (
                    <StyledHex
                      key={i}
                      q={hex.q}
                      r={hex.r}
                      s={hex.s}
                      owner={hex.owner}
                      type={hex.type}
                      color="latest"
                      className="latest"
                      onClick={(event, hexCoord) =>
                        selectedHex(
                          event,
                          hexCoord,
                          hex.owner,
                          hex.type,
                          hex.color,
                          hex.question,
                          hex.answer,
                          hex.popup
                        )
                      }
                    >
                      <Text>{diff}</Text>
                    </StyledHex>
                  ) : (
                    <StyledHex
                      key={i}
                      q={hex.q}
                      r={hex.r}
                      s={hex.s}
                      owner={hex.owner}
                      type={hex.type}
                      color={hex.color}
                      className={hex.color}
                      onClick={(event, hexCoord) =>
                        selectedHex(
                          event,
                          hexCoord,
                          hex.owner,
                          hex.type,
                          hex.color,
                          hex.question,
                          hex.answer,
                          hex.popup
                        )
                      }
                    >
                      {hex.color === user.name ? (
                        <Text>{diff}</Text>
                      ) : (
                        <Text></Text>
                      )}
                    </StyledHex>
                    // return (
                    //   <StyledHex
                    //     q={hex.q}
                    //     r={hex.r}
                    //     s={hex.s}
                    //     className={hex.color}
                    //   >
                    //     <Text>{diff}</Text>
                    //   </StyledHex>
                  );
                })
              ) : (
                <p>Nothing here</p>
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
          <AnswerModal
            show={answerShow}
            onHide={answerClose}
            color={descTile.color}
            popup={descTile.popup}
          ></AnswerModal>
          <Loading open={isLoading}></Loading>
        </div>
      </>
    </React.Fragment>
  );
}

export default Map;
