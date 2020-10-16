import React from 'react';
import { Tooltip, GraphLegend, LegendDisplayMode, VerticalGroup } from '@grafana/ui';
import { formattedValueToString, getValueFormat, dateTimeFormatISO } from '@grafana/data';
import { Axis, TimeXYDatumProps } from './types';

interface LegendProps {
  color: string;
  label: string;
  isVisible: boolean;
  yAxis: number;
}

interface PlotCirclesProps {
  data: TimeXYDatumProps[];
  radius: number;
  xAxis: Axis;
  yAxis: Axis;
  xScale: (a: number) => number;
  yScale: (a: number) => number;
  legend: LegendProps;
  timeZone: string;
}

export class PlotCircles extends React.PureComponent<PlotCirclesProps> {
  render() {
    const { data, radius, xAxis, yAxis, xScale, yScale, legend, timeZone } = this.props;
    return (
      <g>
        {data.map(datum => {
          if (datum.timestamp !== null && datum.x !== null && datum.y !== null) {
            const timestamp = dateTimeFormatISO(datum.timestamp, { timeZone: timeZone })
              .replace('T', ' ')
              .replace('+', ' +');
            const x = formattedValueToString(getValueFormat(xAxis.unit)(datum.x, xAxis.decimals));
            const y = formattedValueToString(getValueFormat(yAxis.unit)(datum.y, yAxis.decimals));
            return (
              <Tooltip
                content={() => {
                  return (
                    <VerticalGroup>
                      <GraphLegend items={[legend]} placement="over" displayMode={LegendDisplayMode.List}></GraphLegend>
                      <div>Time: {timestamp}</div>
                      <div>
                        {xAxis.label}: {x}
                      </div>
                      <div>
                        {yAxis.label}: {y}
                      </div>
                    </VerticalGroup>
                  );
                }}
                theme="info"
              >
                <circle r={String(radius)} cx={xScale(datum.x)} cy={yScale(datum.y)} fill={legend.color}></circle>
              </Tooltip>
            );
          } else {
            return;
          }
        })}
      </g>
    );
  }
}
