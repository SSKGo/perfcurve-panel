import React from 'react';
import { CanvasOptions } from 'types';
import { css, cx } from 'emotion';
import * as d3 from 'd3';
import { CurvePoints } from './types';
import { PlotCircles } from './PlotCircles';
import { stylesFactory } from '@grafana/ui';
import { GraphLegend, LegendDisplayMode, LegendItem } from '@grafana/ui';
import { PanelProps } from '@grafana/data';
import { Field, FieldType, getFieldDisplayName } from '@grafana/data';

interface Props extends PanelProps<CanvasOptions> {}

export const PerformanceCurvePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const styles = getStyles();
  const padding = { top: 20, right: 20, bottom: 70, left: 60 };

  type ChartDatum = { x: number; y: number };
  type CurveData = { color: string; data: ChartDatum[] };

  // Read performance curve data
  const performanceCurveData: CurvePoints[] = options.performanceCurveData;
  let dataCurves: CurveData[] = [];
  for (const [index, performanceCurveDatum] of performanceCurveData.entries()) {
    let curveXArray: string[] = performanceCurveDatum.performCurveX.split(',');
    let curveYArray: string[] = performanceCurveDatum.performCurveY.split(',');
    dataCurves[index] = { color: performanceCurveDatum.color, data: [] };
    for (let i = 0; i < Math.min(curveXArray.length, curveYArray.length); i++) {
      dataCurves[index].data[i] = { x: Number(curveXArray[i]), y: Number(curveYArray[i]) };
    }
  }

  // Read point radius
  const pointRadius: number = options.pointRadius;
  // Create series name array
  let seriesName: string[] = [];
  for (let i = 0; i < data.series.length; i++) {
    let name = data.series[i].name;
    if (name) {
      seriesName[i] = name;
    } else {
      seriesName[i] = '';
    }
  }
  // Read data and prepare data array for plot
  let dataPlot: Array<Array<[number, number]>> = [[]];
  let dataLegend: LegendItem[] = [];
  const plotSetting = options.plotSetting;
  const plotSettingLength = plotSetting.length;

  // Create merged fields from series
  let mergedFields: Field[] = [];
  data.series.map(frame => {
    if (frame.name !== undefined) {
      // time_series
      let valueField = frame.fields.find(field => field.type === FieldType.number);
      if (valueField) {
        let valueFieldName = getFieldDisplayName(valueField, frame);
        valueField.name = valueFieldName;
        mergedFields.push(valueField);
      }
    } else {
      // table
      frame.fields.map(field => {
        if (field.type === FieldType.number) {
          let valueField = field;
          mergedFields.push(valueField);
        }
      });
    }
  });

  for (let i = 0; i < plotSettingLength; i++) {
    let fieldX = mergedFields.find(field => field.name === plotSetting[i].xField);
    let fieldY = mergedFields.find(field => field.name === plotSetting[i].yField);
    if (fieldX && fieldY) {
      let xData = fieldX.values.toArray();
      let yData = fieldY.values.toArray();
      // data for plot
      dataPlot[i] = [];
      for (let j = 0; j < xData.length; j++) {
        dataPlot[i][j] = [xData[j], yData[j]];
      }
      // data for legend
      dataLegend[i] = {
        color: plotSetting[i].color,
        label: plotSetting[i].label,
        isVisible: true,
        yAxis: 1,
      };
    }
  }

  // Read X-axis and Y-Axis settings
  const xLabel = options.xAxis.label;
  const xMin = options.xAxis.minValue;
  const xMax = options.xAxis.maxValue;
  const yLabel = options.yAxis.label;
  const yMin = options.yAxis.minValue;
  const yMax = options.yAxis.maxValue;

  // Scale
  const xScale = d3
    .scaleLinear()
    .domain([xMin, xMax || 0.0])
    .range([padding.left, width - padding.right]);
  const yScale = d3
    .scaleLinear()
    .domain([yMin, yMax || 0.0])
    .range([height - padding.bottom, padding.top]);
  // Create axis
  const xAxis = d3.axisBottom(xScale).ticks(width / 80);
  const yAxis = d3.axisLeft(yScale).ticks(height / 80);

  // Draw performance curve
  const curveGenerator = d3
    .line<ChartDatum>()
    .curve(d3.curveBasis)
    .x((d: ChartDatum) => xScale(d.x))
    .y((d: ChartDatum) => yScale(d.y));

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <svg
        className={styles.svg}
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* xAxis */}
        <g
          transform={`translate(0, ${height - padding.bottom})`}
          ref={node => {
            d3.select(node).call(xAxis as any);
          }}
        >
          <text
            x={(width - padding.left - padding.right) / 2 + padding.left}
            y="40"
            text-anchor="middle"
            fill="currentColor"
            font-size="8pt"
          >
            {xLabel}
          </text>
        </g>
        {/* yAxis */}
        <g
          transform={`translate(${padding.left}, 0)`}
          ref={node => {
            d3.select(node).call(yAxis as any);
          }}
        >
          <text
            x={-(height - padding.top - padding.bottom) / 2}
            y="-50"
            text-anchor="middle"
            fill="currentColor"
            transform="rotate(-90)"
            font-size="8pt"
          >
            {yLabel}
          </text>
        </g>
        {/* Grid Vertical Lines */}
        <g>
          {xScale.ticks().map((d: number) => {
            return (
              <line
                stroke="currentColor"
                stroke-opacity="0.1"
                y1={padding.top}
                y2={height - padding.bottom}
                x1={0.5 + xScale(d)}
                x2={0.5 + xScale(d)}
              ></line>
            );
          })}
        </g>
        {/* Grid Horizontal Lines */}
        <g>
          {yScale.ticks().map((d: number) => {
            return (
              <line
                stroke="currentColor"
                stroke-opacity="0.1"
                x1={padding.left}
                x2={width - padding.right}
                y1={0.5 + yScale(d)}
                y2={0.5 + yScale(d)}
              ></line>
            );
          })}
        </g>
        {/* Curve */}
        {dataCurves.map((dataCurve, index) => {
          return (
            <g id="curve-group">
              <path
                fill="none"
                stroke={dataCurve.color}
                stroke-width="1.5"
                id={'curve-' + { index }}
                ref={node => {
                  d3.select(node)
                    .datum(dataCurve.data)
                    .attr('d', curveGenerator);
                }}
              />
            </g>
          );
        })}
        {/* Plot */}
        <g id="plot-group">
          {dataPlot.map((data, i) => {
            return (
              <PlotCircles
                data={data}
                radius={pointRadius}
                xScale={xScale}
                yScale={yScale}
                color={plotSetting[i].color}
              ></PlotCircles>
            );
          })}
        </g>
      </svg>
      <div className={styles.legend}>
        <GraphLegend items={dataLegend} displayMode={LegendDisplayMode.List} placement="under"></GraphLegend>
      </div>
    </div>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    legend: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
  };
});
