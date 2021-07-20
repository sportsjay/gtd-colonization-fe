import React, { useState, useEffect } from "react";

import { Cont } from "./Style";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

import axios from "axios";
import zIndex from "@material-ui/core/styles/zIndex";

function WinModal(props) {
  return (
    <Modal show={props.show} onHide={props.onHide} centered>
      <Modal.Header>
        <Modal.Title>Here is the clue to the pandora box</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function ClueModal(props) {
  return (
    <Modal show={props.show} onHide={props.onHide} centered>
      <Modal.Header>
        <img
          src="https://drive.google.com/uc?id=1eB7OjJfOBreuGaqm9YayILoppKEFaAKN"
          style={{ width: 470 }}
        ></img>
      </Modal.Header>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export function Winner(props) {
  const ans = React.createRef();

  const [show, setShow] = useState(false);
  const [clueShow, setClueShow] = useState(false);
  const closeClue = () => {
    setClueShow(false);
  };
  const onHide = () => {
    setShow(false);
  };

  //   const submit = () => {
  //     const token = localStorage.getItem("token");
  //     const config = {
  //       headers: { "auth-token": token },
  //     };
  //     if (token) {
  //       axios
  //         .post(
  //           "map/final",
  //           {
  //             answer: ans.current.value,
  //           },
  //           config
  //         )
  //         .then((res) => {
  //           setShow(true);
  //           setWin(true);
  //         })
  //         .catch((err) => {
  //           props.setFailShow(true);
  //           props.setChangeColor({
  //             status: false,
  //             error: err.response.data.message,
  //           });
  //         });
  //     }
  //   };

  return (
    <>
      <Cont>
        <div
          style={{ height: "10vh", fontWeight: "bold", textAlign: "center" }}
        >
          CONGRATULATIONS, <br></br>YOU HAVE COMPLETED 5 STATIONS. <br></br>
          HERE IS A CLUE TO THE PANDORA'S BOX!!
        </div>
        <div style={{ height: "5vh" }}>Life begins and ends with the sun.</div>
        <Button
          onClick={() => {
            setClueShow(true);
          }}
        >
          Clue
        </Button>
        {/* <Form>
            <Form.Group>
              <Form.Control
                placeholder="Answer"
                aria-describedby="basic-addon1"
                ref={ans}
              ></Form.Control>
            </Form.Group>
          </Form>
          <Button onClick={submit}>Submit</Button> */}
      </Cont>
      <WinModal show={show} onHide={onHide}></WinModal>
      <ClueModal show={clueShow} onHide={closeClue}></ClueModal>
    </>
  );
}
