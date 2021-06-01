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

function FailModal(props){
  if(props.type==="unclaimed"){
    return(
      <Modal show={props.show} onHide={props.onHide}
      aria-labelledby="contained-modal-title-vcenter">
        <ModalHeader closeButton>
          <ModalTitle>That tile is not yours!</ModalTitle>
        </ModalHeader>
        <ModalFooter>
          <Button onClick={props.onHide}>Close</Button>
        </ModalFooter>
      </Modal>
    )
  }
  else{
    return(
      <Modal show={props.show} onHide={props.onHide} aria-labelledby="contained-modal-title-vcenter">
        <ModalHeader closeButton>
          <ModalTitle>That tile is claimed!</ModalTitle>
        </ModalHeader>
        <ModalFooter>
          <Button onClick={props.onHide}>Close</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

function Map(props) {
  // const hexagons = GridGenerator.rectangle(30, 30);

  // Initialize States
  const [hexagons, setHexagons] = useState(data); // hexagons is the local state which refers to the json data as initial data
  const [user, setUser] = useState("group1"); // test user state only
  const [selectedTiles, setSelectedTiles]=useState({q:-3,r:-3,s:6}); // state to save the coordinates after selecting
  const [ownerTiles,setOwnerTiles]=useState({owner:"none"}); // state to save the owner variable after selecting
  const [claimedTiles,setClaimedTiles]=useState({type:"unclaimed"}); // state to save the type variable after selecting
  const [ownedTiles,setOwnedTiles]=useState(data.filter(hex=>hex.type==="claimed")); // state to know every data that is claimed
  const [active,setActive]=useState(true); //active or deactive the highlight
  const [neighbourTiles,setNeighbourTiles]=useState(ownedTiles.map(hex=>data.filter(hexv2=>(HexUtils.distance(hex,hexv2)===1 && hexv2.type!=="claimed"))));
  const neighbours=[];
  for(let i=0; i<neighbourTiles.length; i++){
    for(let j=0; j<neighbourTiles[i].length; j++){
      neighbours.push({q:neighbourTiles[i][j].q,r:neighbourTiles[i][j].r,s:neighbourTiles[i][j].s,type:neighbourTiles[i][j].type,owner:neighbourTiles[i][j].owner,props:neighbourTiles[i][j].props});
    }
  }
  const set=new Set();
  for(let i=0; i<neighbours.length; i++){
    set.add(JSON.stringify(neighbours[i]));
  }

  const [show,setShow]=useState(false); //use to pop up base Modal
  const handleClose=()=>setShow(false); //to close the base Modal

  const [failShow,setFailShow]=useState(false);
  const failClose=()=>setFailShow(false);
  // function to handle on click

  function clickHex(event, source, owner, type) {
    // click validation based on tile ownership
    setActive(false);
    const targetHex = selectedTiles;
    let x=0;
    // to check if its distance is adjacent to the claimed tiles
    for(let i=0; i<ownedTiles.length; i++){
      if(HexUtils.distance(targetHex,ownedTiles[i])===1){
        x=1;
        break;
      }
    }
    if (owner === user && x===1 && type!=="claimed") {
      const coloredHexas = hexagons.map((hex) => {
        // Highlight tiles that are next to the target (1 distance away)
        if(HexUtils.distance(targetHex,hex)===0){
          if(hex.props.className.includes("active")){
            hex.props.className=String(owner);
          }
          else{
            hex.props.className+=String(owner);
          }
        }
        if(HexUtils.distance(targetHex, hex)===1){
          if(hex.props.className.includes("active") || hex.props.className.includes(String(owner))){
            console.log("here!")
          }
          else{
            hex.props.className+="active";
          }
        }
        if(set.has(JSON.stringify(hex))){
          if(hex.props.className.includes("active") || hex.props.className.includes(String(owner))){
            console.log("here!");
          }
          else{
            hex.props.className+="active";
          }
        }
        // Highlight clicked tile
        return hex;
      });
      setHexagons(coloredHexas);
    } else {
      setFailShow(true);
    }
    setShow(false);
  }

  //a function to pass all the props and change every state
  function selectedHex(event,source,owner,type){
    setShow(true);
    setSelectedTiles(source.state.hex);
    setOwnerTiles(owner);
    setClaimedTiles(type);
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
          {hexagons.map((hex,i)=>{const state=active ? "active" : hex.props.className
            return hex.type==="claimed" ? <StyledHex
              key={i}
              q={hex.q}
              r={hex.r}
              s={hex.s}
              owner={hex.owner}
              type={hex.type}
              className={hex.owner}
              onClick={(_,hexCoord)=>selectedHex(_,hexCoord,hex.owner,hex.type)}
            /> : set.has(JSON.stringify(hex)) ? <StyledHex
            key={i}
            q={hex.q}
            r={hex.r}
            s={hex.s}
            owner={hex.owner}
            type={hex.type}
            className={state}
            onClick={(_,hexCoord)=>selectedHex(_,hexCoord,hex.owner,hex.type)}
          /> : <StyledHex
          key={i}
          q={hex.q}
          r={hex.r}
          s={hex.s}
          owner={hex.owner}
          type={hex.type}
          className={hex.props.className}
          onClick={(_,hexCoord)=>selectedHex(_,hexCoord,hex.owner,hex.type)}
        />})}
        </Layout>
      </HexGrid>
      <Modal show={show} onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter">
        <ModalHeader closeButton>
          <ModalTitle>Confirm on selecting q={selectedTiles.q} r={selectedTiles.r} s={selectedTiles.s}?</ModalTitle>
        </ModalHeader>
        <ModalFooter>
          <Button variant="primary" onClick={handleClose} >
            No
          </Button>
          <Button variant="secondary" onClick={(_)=>clickHex(_,selectedTiles,ownerTiles,claimedTiles)}>
            Yes
          </Button>
        </ModalFooter>
      </Modal>
      <FailModal show={failShow} onHide={failClose} type={claimedTiles}></FailModal>
    </div>
    </>
  );
}

export default Map;