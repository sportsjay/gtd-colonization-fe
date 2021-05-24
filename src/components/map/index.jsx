import React, { useState } from "react";
import { HexGrid, Layout, Hexagon, Text, HexUtils } from "react-hexgrid";
import "./index.css";

import { data } from "./sample.json";

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

function Map(props) {
  // const hexagons = GridGenerator.rectangle(30, 30);

  // Initialize States
  const [hexagons, setHexagons] = useState(data); // hexagons is the local state which refers to the json data as initial data
  const [user, setUser] = useState("group1"); // test user state only
  const [ownedTiles, setOwnedTiles] = useState(
    data.filter((hex) => user === hex.owner) // filter tiles which are owned
  );
  console.log(ownedTiles);

  // function to handle on click
  function clickHex(event, source, owner, type) {
    // click validation based on tile ownership
    const targetHex = source.state.hex;
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
    } else {
      alert("Not your tile!");
    }
  }

  return (
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
              onClick={(_, hexCoord) =>
                clickHex(_, hexCoord, hex.owner, hex.type)
              }
            />
          ))}
        </Layout>
      </HexGrid>
    </div>
  );
}

export default Map;
