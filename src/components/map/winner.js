import React, { useState } from "react";

import { Cont } from "./Style";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

function ClueModal(props) {
  return (
    <Modal show={props.show} onHide={props.onHide} centered>
      <Modal.Header>
        <img
          src="https://drive.google.com/uc?id=17JBX0vsl8BrNMHRJR4m80yMyU3HATAIX"
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
  const [clueShow, setClueShow] = useState(false);
  const closeClue = () => {
    setClueShow(false);
  };

  return (
    <>
      <Cont>
        <div
          style={{ height: "10vh", fontWeight: "bold", textAlign: "center" }}
        >
          CONGRATULATIONS, <br></br>YOU HAVE COMPLETED 5 STATIONS. <br></br>
          HERE IS A CLUE TO THE PANDORA'S BOX!!
        </div>
        <Button
          onClick={() => {
            setClueShow(true);
          }}
        >
          Clue
        </Button>
      </Cont>
      <ClueModal show={clueShow} onHide={closeClue}></ClueModal>
    </>
  );
}
