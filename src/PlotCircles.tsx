import React from 'react';
import { Tooltip, VizLegend, LegendDisplayMode, VerticalGroup, VizLegendItem } from '@grafana/ui';
import { formattedValueToString, getValueFormat, dateTimeFormatISO } from '@grafana/data';
import { Axis, TimeXYDatumProps } from './types';

interface PlotCirclesProps {
  data: TimeXYDatumProps[];
  radius: number;
  xAxis: Axis;
  yAxis: Axis;
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  legend: VizLegendItem;
  timeZone: string;
}

export class PlotCircles extends React.PureComponent<PlotCirclesProps> {
  render() {
    const { data, radius, xAxis, yAxis, xScale, yScale, legend, timeZone } = this.props;
    return (
      <g>
        {data.map((datum) => {
          if (datum.timestamp !== null && datum.x !== null && datum.y !== null) {
            const timestamp = dateTimeFormatISO(datum.timestamp, { timeZone: timeZone })
              .replace('T', ' ')
              .replace('+', ' +');
            const xFormarted = formattedValueToString(getValueFormat(xAxis.unit)(datum.x, xAxis.decimals));
            const yFormarted = formattedValueToString(getValueFormat(yAxis.unit)(datum.y, yAxis.decimals));
            return (
              <Tooltip
                content={() => {
                  return (
                    <VerticalGroup>
                      <VizLegend items={[legend]} placement="bottom" displayMode={LegendDisplayMode.List} />
                      <div>Time: {timestamp}</div>
                      <div>
                        {xAxis.label}: {xFormarted}
                      </div>
                      <div>
                        {yAxis.label}: {yFormarted}
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
