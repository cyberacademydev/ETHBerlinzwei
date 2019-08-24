import React from 'react';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from 'victory';

const orgLine=[
  { x: 1, y: 2 },
  { x: 2, y: 3 },
  { x: 3, y: 5 },
  { x: 4, y: 4 },
  { x: 5, y: 7 }
];
const speakLine=[
  { x: 1, y: 9 },
  { x: 2, y: 8 },
  { x: 3, y: 5 },
  { x: 4, y: 4 },
  { x: 5, y: 1 }
];
const dataLine=[
  { x: 2, y: 0},
  { x: 2, y: 9}
];

export default class Graph extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
        <div style={{height:400, width:600}}>
          <VictoryChart>
            <VictoryAxis
              style={{
                axis: {stroke: "grey"},
                axisLabel: {fontSize: 20, padding: 30},
                grid: {stroke: "grey", size: 5},
                ticks: {stroke: "grey", size: 5},
                tickLabels: {fontSize: 15, padding: 5, fill: "grey" }
              }}
            />
            <VictoryAxis
              dependentAxis
              style={{
                axis: {stroke: "grey"},
                axisLabel: {fontSize: 20, padding: 30},
                grid: {stroke: "grey", size: 5},
                ticks: {stroke: "grey", size: 5},
                tickLabels: {fontSize: 15, padding: 5, fill: "grey" }
              }}
            />
            <VictoryLine
              style={{
                data: { stroke: "#c43a31" },
                parent: { border: "1px solid #ccc"}
              }}
              data={orgLine}
            />
            <VictoryLine
              style={{
                data: { stroke: "blue" },
                parent: { border: "1px solid #ccc"}
              }}
              data={speakLine}
            />
             <VictoryLine
              style={{
                data: { stroke: "green" },
                parent: { border: "1px solid #ccc"}
              }}
              data={dataLine}
            />
          </VictoryChart>
          </div>
        )
    }
}

