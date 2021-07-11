import React from 'react';
import { PanelOptionsEditorProps } from '@grafana/data';
import { Button, ColorPicker, HorizontalGroup, Input, Label, Tooltip, VerticalGroup } from '@grafana/ui';
import { PlotSeries } from './types';

interface PlotSeriesrops {
  value: PlotSeries;
  index?: number;
  styles?: any;
  onChangeItem?: (a: PlotSeries, b: number) => void | undefined;
  onDelete?: (a: number) => void;
}

class PlotSeriesForm extends React.PureComponent<PlotSeriesrops> {
  constructor(props: PlotSeriesrops) {
    super(props);
    this.state = { ...props.value };
  }
  render() {
    const { value, index, onChangeItem, onDelete } = this.props;
    return (
      <HorizontalGroup>
        <Label>Label</Label>
        <Input
          css=""
          type="text"
          name="label"
          defaultValue={value.label}
          onBlur={(e) => {
            const label = e.currentTarget.value;
            this.setState(() => {
              return { label: label };
            });
            onChangeItem && index !== undefined && onChangeItem({ ...value, label: label }, index);
          }}
        />
        <Label>X</Label>
        <Input
          css=""
          type="text"
          name="xField"
          defaultValue={value.xField}
          onBlur={(e) => {
            const xField = e.currentTarget.value;
            this.setState(() => {
              return { xField: xField };
            });
            onChangeItem && index !== undefined && onChangeItem({ ...value, xField: xField }, index);
          }}
        />
        <Label>Y</Label>
        <Input
          css=""
          type="text"
          name="yField"
          defaultValue={value.yField}
          onBlur={(e) => {
            const yField = e.currentTarget.value;
            this.setState(() => {
              return { yField: yField };
            });
            onChangeItem && index !== undefined && onChangeItem({ ...value, yField: yField }, index);
          }}
        />
        <Label>Color</Label>
        <ColorPicker
          color={value.color}
          onChange={(color) => {
            this.setState(() => {
              return { color: color };
            });
            onChangeItem && index !== undefined && onChangeItem({ ...value, color: color }, index);
          }}
        ></ColorPicker>
        {onDelete && index !== undefined && (
          <Tooltip content="Remove this operation points." theme={'info'}>
            <Button
              variant="destructive"
              icon="trash-alt"
              size="sm"
              onClick={() => {
                onDelete(index);
              }}
            ></Button>
          </Tooltip>
        )}
      </HorizontalGroup>
    );
  }
}

export class PlotSeriesForms extends React.PureComponent<PanelOptionsEditorProps<PlotSeries[]>> {
  onChangeItem = (updatedValue: PlotSeries, index: number) => {
    let newValues = [...this.props.value];
    newValues[index] = updatedValue;
    this.props.onChange(newValues);
  };
  onAdd = (newValue: PlotSeries) => {
    let newValues = [...this.props.value, newValue];
    this.props.onChange(newValues);
  };
  onDelete = (index: number) => {
    let newValues = [...this.props.value];
    newValues.splice(index, 1);
    this.props.onChange(newValues);
  };
  render() {
    const curves = this.props.value;
    return (
      <VerticalGroup>
        <Tooltip content="Add a new plot." theme={'info'}>
          <Button
            variant="secondary"
            size="sm"
            icon="plus"
            onClick={() => {
              this.onAdd({
                label: '',
                xField: '',
                yField: '',
                color: 'rgba(136, 136, 136, 0.6)',
              } as PlotSeries);
            }}
          >
            Add
          </Button>
        </Tooltip>
        {curves.map((curve: PlotSeries, index: number) => {
          return (
            <PlotSeriesForm
              key={index}
              value={curve}
              index={index}
              onChangeItem={this.onChangeItem}
              onDelete={this.onDelete}
            />
          );
        })}
      </VerticalGroup>
    );
  }
}
