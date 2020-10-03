import React from 'react';
import { PanelOptionsEditorProps } from '@grafana/data';
import { Input, HorizontalGroup, Label, UnitPicker, VerticalGroup } from '@grafana/ui';
import { Axis } from './types';

export class AxisForms extends React.PureComponent<PanelOptionsEditorProps<Axis>> {
  render() {
    const axis = this.props.value;
    return (
      <VerticalGroup>
        <HorizontalGroup>
          <Label>Min</Label>
          <Input
            type="number"
            name="minValue"
            value={axis.minValue}
            onChange={e => {
              const minValue = e.currentTarget.value;
              this.setState(() => {
                return { minValue: Number(minValue) };
              });
              this.props.onChange({ ...this.props.value, minValue: Number(minValue) });
            }}
          />
          <Label>Max</Label>
          <Input
            type="number"
            name="maxValue"
            defaultValue={axis.maxValue}
            onChange={e => {
              const maxValue = e.currentTarget.value;
              this.setState(() => {
                return { maxValue: Number(maxValue) };
              });
              this.props.onChange({ ...this.props.value, maxValue: Number(maxValue) });
            }}
          />
          <Label>Label</Label>
          <Input
            type="text"
            name="label"
            defaultValue={axis.label}
            onChange={e => {
              const label = e.currentTarget.value;
              this.props.onChange({ ...this.props.value, label: label });
              this.setState(() => {
                return { label: label };
              });
            }}
          />
        </HorizontalGroup>
        <HorizontalGroup>
          <Label>Unit</Label>
          <UnitPicker
            value={axis.unit}
            onChange={unit => {
              this.props.onChange({ ...this.props.value, unit: unit });
              this.setState(() => {
                return { unit: unit };
              });
            }}
          />
          <Label>Decimals</Label>
          <Input
            type="number"
            name="decimals"
            defaultValue={axis.decimals}
            onChange={e => {
              const decimals = e.currentTarget.value;
              this.props.onChange({ ...this.props.value, decimals: Number(decimals) });
              this.setState(() => {
                return { decimals: decimals };
              });
            }}
          />
        </HorizontalGroup>
      </VerticalGroup>
    );
  }
}
