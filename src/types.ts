import { Field } from '@grafana/data';

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
  unit: string | undefined;
  decimals: number | undefined;
}

export interface CanvasOptions {
  xAxis: Axis;
  yAxis: Axis;
  performanceCurveData: CurvePoints[];
  dynamicPerfCurve: CurveGroup[];
  plotSetting: PlotSeries[];
  pointRadius: number;
}

export interface MergedFieldsProps {
  name: string;
  timeField: Field;
  valueField: Field;
}

export interface TimeXYDatumProps {
  timestamp: number | undefined;
  x: number | undefined;
  y: number | undefined;
}
