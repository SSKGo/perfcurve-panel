import React from 'react';
// import * as d3 from 'd3';
import { Tooltip } from '@grafana/ui';

interface PlotCirclesProps {
  data: Array<[number, number]>;
  radius: number;
  xLabel: string;
  yLabel: string;
  xScale: (a: number) => number;
  yScale: (a: number) => number;
  color: string;
}

export class PlotCircles extends React.PureComponent<PlotCirclesProps> {
  render() {
    const { data, radius, xLabel, yLabel, xScale, yScale, color } = this.props;
    return (
      <g>
        {data.map((datum: [number, number]) => {
          return (
            <Tooltip content={
              `${xLabel}: ${datum[0]}, ${yLabel}: ${datum[1]}`
            } theme={'info'}>
              <circle r={String(radius)} cx={xScale(datum[0])} cy={yScale(datum[1])} fill={color}
              >
              </circle>
            </Tooltip>
          );
        })
        }
      </g >
    );
  }
}
