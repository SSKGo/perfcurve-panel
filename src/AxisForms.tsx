import React from 'react';
import { PanelOptionsEditorProps } from '@grafana/data';
import { Input, HorizontalGroup, Label, VerticalGroup } from '@grafana/ui';
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
              console.log('minValue');
              const minValue = e.currentTarget.value;
              // this.setState(() => {
              //   return { minValue: Number(minValue) };
              // });
              this.props.onChange({ ...this.props.value, minValue: Number(minValue) });
              console.log(this.props.value);
            }}
          />
          <Label>Max</Label>
          <Input
            type="number"
            name="maxValue"
            defaultValue={axis.maxValue}
            onChange={e => {
              const maxValue = e.currentTarget.value;
              this.props.onChange({ ...this.props.value, maxValue: Number(maxValue) });
              // this.setState(() => {
              //   return { maxValue: Number(maxValue) };
              // });
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
      </VerticalGroup>
    );
  }
}
