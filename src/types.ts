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

export interface CanvasOptions {
  xLabel: string;
  yLabel: string;
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
  curveColor: string;
  performanceCurveData: CurvePoints[];
  plotSetting: PlotSeries[];
  pointRadius: number;
}
