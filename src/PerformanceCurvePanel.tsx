import React from 'react';
import { css, cx } from 'emotion';
import * as d3 from 'd3';
import { stylesFactory } from '@grafana/ui';
import { GraphLegend, LegendDisplayMode, LegendItem } from '@grafana/ui';
import { getValueFormat } from '@grafana/data';
import { PanelProps } from '@grafana/data';
import { CanvasOptions, CurvePoints, MergedFieldsProps, TimeXYDatumProps } from './types';
import { Curves } from './Curves';
import { PlotCircles } from './PlotCircles';
import { createMergedFields, mergeXYField } from './dataHandler';

interface Props extends PanelProps<CanvasOptions> { }

export const PerformanceCurvePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const styles = getStyles();
  const padding = { top: 20, right: 20, bottom: 70, left: 60 };

  type ChartDatum = { x: number; y: number };
  type CurveData = { color: string; data: ChartDatum[] };
  type DynamicCurveData = { color: string; data: ChartDatum[][] };

  // Read static performance curve data
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

  // Create time-value merged field array from data
  // mergedFields is used for plotting operation point and drawing dynamic performance curve
  let mergedFields: MergedFieldsProps[] = createMergedFields(data);

  // Prepare data array for plotting operation point
  const plotSetting = options.plotSetting;
  let dataPlot: TimeXYDatumProps[][] = [];
  let dataLegend: LegendItem[] = [];
  for (let i = 0; i < plotSetting.length; i++) {
    let fieldPlotX = mergedFields.find(field => field.name === plotSetting[i].xField);
    let fieldPlotY = mergedFields.find(field => field.name === plotSetting[i].yField);
    if (fieldPlotX && fieldPlotY) {
      // Create time-x-y merged array
      let timeXYData: TimeXYDatumProps[] = mergeXYField(fieldPlotX, fieldPlotY);
      dataPlot[i] = timeXYData;
      // data for legend
      dataLegend[i] = {
        color: plotSetting[i].color,
        label: plotSetting[i].label,
        isVisible: true,
        yAxis: 1,
      };
    }
  }

  // Prepare dynamic performance curve data
  const dynamicPerfCurve = options.dynamicPerfCurve;
  let dataDynamicCurves: DynamicCurveData[] = [];
  for (let i = 0; i < dynamicPerfCurve.length; i++) {
    let fieldGroup = dynamicPerfCurve[i].fieldGroup;
    dataDynamicCurves[i] = {
      color: options.dynamicPerfCurve[i].color,
      data: [],
    };
    // j: point(x, y)
    for (let j = 0; j < fieldGroup.length; j++) {
      let fieldCurveX = mergedFields.find(field => field.name === fieldGroup[j].xField);
      let fieldCurveY = mergedFields.find(field => field.name === fieldGroup[j].yField);
      if (fieldCurveX && fieldCurveY) {
        // Create time-x-y merged array
        let timeXYData: TimeXYDatumProps[] = mergeXYField(fieldCurveX, fieldCurveY);
        // data for curve
        // i:curve, k: time, j: point(x, y)
        for (let k = 0; k < timeXYData.length; k++) {
          if (dataDynamicCurves[i].data[k] === undefined) {
            dataDynamicCurves[i].data[k] = [];
          }
          let xPoint = timeXYData[k].x;
          let yPoint = timeXYData[k].y;
          if (xPoint && yPoint) {
            dataDynamicCurves[i].data[k][j] = { x: xPoint, y: yPoint };
          }
        }
      }
    }
  }

  // Read X-axis and Y-Axis settings
  const xMin = options.xAxis.minValue;
  const xMax = options.xAxis.maxValue;
  const yMin = options.yAxis.minValue;
  const yMax = options.yAxis.maxValue;

  // Function to add unit to axis label
  const getLabelWithUnit = (label: string, unit: string | undefined) => {
    const unitToIndicate = getValueFormat(unit)(0).suffix;
    if (unitToIndicate) {
      return label + ` [${unitToIndicate?.trim()}]`;
    } else {
      return label;
    }
  };

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
            {getLabelWithUnit(options.xAxis.label, options.xAxis.unit)}
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
            {getLabelWithUnit(options.yAxis.label, options.yAxis.unit)}
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
        {/* Static Curve */}
        {dataCurves.map((dataCurve, index) => {
          return (
            <g id="static-curve-group">
              <path
                fill="none"
                stroke={dataCurve.color}
                stroke-width="1.5"
                id={'curve-' + index}
                ref={node => {
                  d3.select(node)
                    .datum(dataCurve.data)
                    .attr('d', curveGenerator);
                }}
              />
            </g>
          );
        })}
        {dataDynamicCurves.map((dataCurve, index) => {
          return (
            <g id="dynamic-curve-group">
              <Curves
                fill="none"
                stroke={dataCurve.color}
                stroke-width="1.5"
                index={index}
                data={dataCurve.data}
                curveGenerator={curveGenerator}
              ></Curves>
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
                xAxis={options.xAxis}
                yAxis={options.yAxis}
                xScale={xScale}
                yScale={yScale}
                legend={dataLegend[i]}
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
