import { MergedFieldsProps, TimeXYDatumProps } from './types';
import { getFieldDisplayName } from '@grafana/data';
import { FieldType, PanelData } from '@grafana/data';

export const mergeXYField = (fieldPlotX: MergedFieldsProps, fieldPlotY: MergedFieldsProps): TimeXYDatumProps[] => {
  // Create array from fields
  let timeArrayX = fieldPlotX.timeField.values.toArray();
  let timeArrayY = fieldPlotY.timeField.values.toArray();
  let valueArrayX = fieldPlotX.valueField.values.toArray();
  let valueArrayY = fieldPlotY.valueField.values.toArray();

  // Create { timestamp: value } object
  // X
  let timeValueObjectX: { [n: number]: number } = {};
  timeArrayX.map((timestamp, index) => {
    timeValueObjectX[timestamp] = valueArrayX[index];
  });
  // Y
  let timeValueObjectY: { [n: number]: number } = {};
  timeArrayY.map((timestamp, index) => {
    timeValueObjectY[timestamp] = valueArrayY[index];
  });

  // Create merged timestamp array
  let timeArrayXY = timeArrayX.concat(timeArrayY);
  timeArrayXY = Array.from(new Set(timeArrayXY)).sort((a: number, b: number) => a - b);

  // Create data array for plot
  let timeXYData: TimeXYDatumProps[] = [];
  timeArrayXY.map((timestamp, index) => {
    timeXYData[index] = { timestamp: timestamp, x: timeValueObjectX[timestamp], y: timeValueObjectY[timestamp] };
  });
  return timeXYData;
};

export const createMergedFields = (data: PanelData): MergedFieldsProps[] => {
  // Create merged fields from series
  let mergedFields: MergedFieldsProps[] = [];
  data.series.map(frame => {
    let timeField = frame.fields.find(field => field.type === FieldType.time);
    if (frame.name !== undefined) {
      // time_series
      let valueField = frame.fields.find(field => field.type === FieldType.number);
      if (valueField && timeField) {
        valueField.name = getFieldDisplayName(valueField, frame);
        mergedFields.push({ name: valueField.name, timeField: timeField, valueField: valueField });
      }
    } else {
      // table
      frame.fields.map(field => {
        if (field.type === FieldType.number && timeField) {
          let valueField = field;
          mergedFields.push({ name: valueField.name, timeField: timeField, valueField: valueField });
        }
      });
    }
  });
  return mergedFields;
};
