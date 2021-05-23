import React, {Component} from "react";
import { HexGrid, Layout, Hexagon, GridGenerator, Text, HexUtils } from 'react-hexgrid';
import './index.css';

// export default function Page(props) {
//   const hexagons = GridGenerator.rectangle(30,30);
//   return (
//     <div className="App">
//       <h1>Basic example of HexGrid usage.</h1>
//       <HexGrid width={1600} height={1200}>
//         <Layout size={{ x: 2, y: 2 }} flat={false} spacing={1.02} origin={{x:-56, y:-45}}>
//           { hexagons.map((hex, i) => <Hexagon key={i} q={hex.q} r={hex.r} s={hex.s} onClick={(e,h)=>Click(e,h)}/>) }
//         </Layout>
//       </HexGrid>
//     </div>
//   );
// }

class App extends Component{
  constructor(props){
    super(props);
    const hexagons=GridGenerator.rectangle(30,30);
    this.state={hexagons,path:{start:null,end:null}};
  }
  state = {
    startTiles: [130, 118, 13, 1],
    leftWall: [130, 117, 104, 91, 78, 65, 52, 39, 26, 13],
    rightWall: [118, 105, 92, 79, 66, 53, 40, 27, 14, 1],
    currentTile: 0,
    canMoveTo: [],
    didStart: false
  }
  onClick(event,source){
    const {hexagons}=this.state;
    const targetHex = source.state.hex;
    const coloredHexas = hexagons.map(hex => {
      hex.props = hex.props || {};
      // Highlight tiles that are next to the target (1 distance away)
      hex.props.className = (HexUtils.distance(targetHex, hex) === 1) ? 'active' : '';
      hex.props.className += (HexUtils.distance(targetHex, hex) === 0) ? ' clicked ' : '';
      return hex;
    });

    this.setState({ hexagons: coloredHexas });
  }
  render(){
    let {hexagons}=this.state;
    return(
      <div className="App">
       <h1>Basic example of HexGrid usage.</h1>
       <HexGrid width={1600} height={1200}>
         <Layout size={{ x: 2, y: 2 }} flat={false} spacing={1.02} origin={{x:-56, y:-45}}>
           { hexagons.map((hex, i) => <Hexagon key={i} q={hex.q} r={hex.r} s={hex.s} className={hex.props ? hex.props.className : null} onClick={(e, h) => this.onClick(e, h)}/>) }
         </Layout>
       </HexGrid>
     </div>
    )
  }
}

export default App;