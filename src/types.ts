export interface CurvePoints {
  performCurveX: string;
  performCurveY: string;
}
export interface PlotSeries {
  label: string;
  xField: string;
  yField: string;
  color: string;
}

export interface Axis {
  minValue: number;
  maxValue: number;
  label: string;
}

export interface CanvasOptions {
  xAxis: Axis;
  yAxis: Axis;
  curveColor: string;
  performanceCurveData: CurvePoints[];
  plotSetting: PlotSeries[];
  pointRadius: number;
}
