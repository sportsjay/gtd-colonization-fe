import React, { useState } from "react";
import { HexGrid, Layout, Hexagon, HexUtils } from "react-hexgrid";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { Modal, ModalFooter, ModalTitle } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import "./index.css";

import { data } from "./sample.json";
import 'bootstrap/dist/css/bootstrap.min.css';

/* the Map function contains the layout of the hexagons, 
  individual hexagons are built from sample.json data which 
  follows the following schema: 
  {
    "q":0,
    "r":0,
    "s":0,
    "type":"claimed",
    "owner":"group1",
    "props":{
      "className":""
    }
  },
*/

// Create Styling Hexagon based of type and owner
function StyledHex(props) {
  const { type, owner, className } = props;
  return <Hexagon {...props} />;
}

// function ConfirmModal(props){
//   <Modal show={props.show} onHide={props.onHide} aria-labelledby="contained-modal-title-vcenter" centered>
//     <ModalHeader closeButton>
//       <ModalTitle>Confirm on what you clicked?</ModalTitle>
//     </ModalHeader>
//     <ModalFooter>
//       <Button variant="primary" onClick={props.onHide} >
//         No
//       </Button>
//       <Button variant="secondary">
//         Yes
//       </Button>
//     </ModalFooter>
//   </Modal>
// }

function Map(props) {
  // const hexagons = GridGenerator.rectangle(30, 30);

  // Initialize States
  const [hexagons, setHexagons] = useState(data); // hexagons is the local state which refers to the json data as initial data
  const [user, setUser] = useState("group1"); // test user state only
  const [selectedTiles, setSelectedTiles]=useState({q:-3,r:-3,s:6});
  const [ownerTiles,setOwnerTiles]=useState({owner:"none"});
  const [ownedTiles, setOwnedTiles] = useState(
    data.filter((hex) => user === hex.owner) // filter tiles which are owned
  );

  const [show,setShow]=useState(false); //use to pop up Modal
  const handleClose=()=>setShow(false); //to close the Modal
  // function to handle on click

  function clickHex(event, source, owner, type) {
    // click validation based on tile ownership
    const targetHex = selectedTiles;
    if (owner === user /* or targetHex is adjacent */) {
      const coloredHexas = hexagons.map((hex) => {
        // Highlight tiles that are next to the target (1 distance away)
        hex.props.className =
          HexUtils.distance(targetHex, hex) === 1 ? "active" : "";
        // Highlight clicked tile
        hex.props.className +=
          HexUtils.distance(targetHex, hex) === 0 ? "clicked" : "";
        return hex;
      });
      setHexagons(coloredHexas);
      setShow(false);
    } else {
      alert("Not your tile!");
    }
  }

  function selectedHex(event,source,owner,type){
    setShow(true);
    setSelectedTiles(source.state.hex);
    console.log(selectedTiles);
    setOwnerTiles(owner);
  }

  return (
    <>
    <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
    integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
    crossorigin="anonymous"
    />
    <div className="App">
      <h1>Basic example of HexGrid usage.</h1>
      <HexGrid width={1600} height={1200}>
        <Layout
          size={{ x: 2, y: 2 }}
          flat={false}
          spacing={1.02}
          origin={{ x: -56, y: -45 }}
        >
          {hexagons.map((hex, i) => (
            <StyledHex
              key={i}
              q={hex.q}
              r={hex.r}
              s={hex.s}
              owner={hex.owner}
              className={hex.props.className}
              onClick={(_,hexCoord)=>selectedHex(_,hexCoord,hex.owner,hex.type)}
            />
          ))}
        </Layout>
      </HexGrid>
      <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>
        <ModalHeader closeButton>
          <ModalTitle>Confirm on selecting q={selectedTiles.q} r={selectedTiles.r} s={selectedTiles.s}?</ModalTitle>
        </ModalHeader>
        <ModalFooter>
          <Button variant="primary" onClick={handleClose} >
            No
          </Button>
          <Button variant="secondary" onClick={(_)=>clickHex(_,selectedTiles,ownerTiles,"unclaimed")}>
            Yes
          </Button>
        </ModalFooter>
      </Modal>
    </div>
    </>
  );
}

export default Map;