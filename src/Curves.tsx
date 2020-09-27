import React from 'react';
import * as d3 from 'd3';

type ChartDatum = { x: number; y: number };

interface CurvesProps {
  fill: string;
  stroke: string;
  'stroke-width': string;
  index: number;
  data: ChartDatum[][];
  curveGenerator: d3.Line<ChartDatum>;
}

export class Curves extends React.PureComponent<CurvesProps> {
  render() {
    const { fill, stroke, data, curveGenerator } = this.props;
    return (
      <g>
        {data.map((dataCurve, index) => {
          return (
            <path
              fill={fill}
              stroke={stroke}
              stroke-width={this.props['stroke-width']}
              id={'curve-' + this.props.index * 100 + index}
              ref={node => {
                return d3
                  .select(node)
                  .datum(dataCurve)
                  .attr('d', curveGenerator);
              }}
            />
          );
        })}
      </g>
    );
  }
}
