export interface CurvePoints {
  performCurveX: string;
  performCurveY: string;
  color: string;
}
export interface PlotSeries {
  label: string;
  xField: string;
  yField: string;
  color: string;
}

export interface CurveItem {
  xField: string;
  yField: string;
}

export interface CurveGroup {
  fieldGroup: CurveItem[];
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
  performanceCurveData: CurvePoints[];
  dynamicPerfCurve: CurveGroup[];
  plotSetting: PlotSeries[];
  pointRadius: number;
}
