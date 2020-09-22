interface PlotCirclesProps {
  data: Array<[number, number]>;
  radius: number;
  xScale: (a: number) => number;
  yScale: (a: number) => number;
  color: string;
}

import React from 'react';

export class PlotCircles extends React.PureComponent<PlotCirclesProps> {
  render() {
    const { data, radius, xScale, yScale, color } = this.props;
    return (
      <g>
        {data.map((datum: [number, number]) => {
          return (
            <circle r={String(radius)} cx={xScale(datum[0])} cy={yScale(datum[1])} fill={color}>
              <title>{`${datum[0]}, ${datum[1]}`}</title>
            </circle>
          );
        })}
      </g>
    );
  }
}
