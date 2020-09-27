import React from 'react';
import { getColorFromHexRgbOrName } from '@grafana/data';
import { PanelOptionsEditorProps } from '@grafana/data';
import { Button, ControlledCollapse, ColorPicker, HorizontalGroup, Input, Label, VerticalGroup } from '@grafana/ui';
import { CurveGroup, CurveItem } from './types';

interface CurveItemFormProps {
  value: CurveItem;
  index: number;
  onChangeItem: (a: CurveItem, b: number) => void | undefined;
  onDeleteItem: (a: number) => void;
}

class CurveItemForm extends React.PureComponent<CurveItemFormProps> {
  constructor(props: CurveItemFormProps) {
    super(props);
    this.state = { ...props.value };
  }
  render() {
    const { value, index, onChangeItem, onDeleteItem } = this.props;
    return (
      <HorizontalGroup>
        <Label>X</Label>
        <Input
          type="text"
          name="xField"
          defaultValue={value.xField}
          onBlur={e => {
            const xField = e.currentTarget.value;
            this.setState(() => {
              return { xField: xField };
            });
            onChangeItem({ ...value, xField: xField }, index);
          }}
        />
        <Label>Y</Label>
        <Input
          type="text"
          name="yField"
          defaultValue={value.yField}
          onBlur={e => {
            const yField = e.currentTarget.value;
            this.setState(() => {
              return { yField: yField };
            });
            onChangeItem({ ...value, yField: yField }, index);
          }}
        />
        <Button
          variant="destructive"
          icon="trash-alt"
          size="sm"
          onClick={() => {
            onDeleteItem(index);
          }}
        >
          Remove
        </Button>
      </HorizontalGroup>
    );
  }
}

interface CurveGroupFormProps {
  value: CurveGroup;
  index: number;
  onChange: (a: CurveGroup, b: number) => void | undefined;
  onDelete: (a: number) => void;
}

class CurveGroupForm extends React.PureComponent<CurveGroupFormProps> {
  constructor(props: CurveGroupFormProps) {
    super(props);
    this.state = { ...props.value };
  }

  onChangeItem = (updatedValue: CurveItem, index: number) => {
    let newValues = [...this.props.value.fieldGroup];
    newValues[index] = updatedValue;
    this.props.onChange({ fieldGroup: newValues, color: this.props.value.color }, this.props.index);
  };
  onAddItem = (newValue: CurveItem) => {
    let newValues = [...this.props.value.fieldGroup, newValue];
    this.props.onChange({ fieldGroup: newValues, color: this.props.value.color }, this.props.index);
  };
  onDeleteItem = (index: number) => {
    let newValues = [...this.props.value.fieldGroup];
    newValues.splice(index, 1);
    this.props.onChange({ fieldGroup: newValues, color: this.props.value.color }, this.props.index);
  };
  render() {
    const { value, index, onChange, onDelete } = this.props;
    return (
      <ControlledCollapse collapsible label={`Line Group ${index}`}>
        <VerticalGroup>
          <HorizontalGroup>
            <Button
              variant="destructive"
              icon="trash-alt"
              size="sm"
              onClick={() => {
                onDelete(index);
              }}
            >
              Remove Line Group
            </Button>
          </HorizontalGroup>
          <HorizontalGroup>
            <Button
              variant="secondary"
              size="sm"
              icon="plus"
              onClick={() => {
                this.onAddItem({
                  xField: '',
                  yField: '',
                } as CurveItem);
              }}
            >
              Add Field
            </Button>

            <Label>Color</Label>
            <ColorPicker
              color={value.color}
              onChange={color => {
                this.setState(() => {
                  return { color: color };
                });
                onChange({ ...value, color: color }, index);
              }}
            ></ColorPicker>
          </HorizontalGroup>
          {value.fieldGroup.map((item: CurveItem, index: number) => {
            return (
              <CurveItemForm
                key={index}
                value={item}
                index={index}
                onChangeItem={this.onChangeItem}
                onDeleteItem={this.onDeleteItem}
              />
            );
          })}
        </VerticalGroup>
      </ControlledCollapse>
    );
  }
}

export class DynamicCurveLineForms extends React.PureComponent<PanelOptionsEditorProps<CurveGroup[]>> {
  onChangeGroup = (updatedValue: CurveGroup, index: number) => {
    let newValues = [...this.props.value];
    newValues[index] = updatedValue;
    this.props.onChange(newValues);
  };
  onAddGroup = (newValue: CurveGroup) => {
    let newValues = [...this.props.value, newValue];
    this.props.onChange(newValues);
  };
  onDeleteGroup = (index: number) => {
    let newValues = [...this.props.value];
    newValues.splice(index, 1);
    this.props.onChange(newValues);
  };
  render() {
    const curves = this.props.value;
    return (
      <VerticalGroup>
        <Button
          variant="secondary"
          size="sm"
          icon="plus"
          onClick={() => {
            this.onAddGroup({
              fieldGroup: [{ xField: '', yField: '' }],
              color: getColorFromHexRgbOrName('rgba(136, 136, 136, 0.6)'),
            } as CurveGroup);
          }}
        >
          Add
        </Button>
        {curves.map((curve: CurveGroup, index: number) => {
          return (
            <CurveGroupForm
              key={index}
              value={curve}
              index={index}
              onChange={this.onChangeGroup}
              onDelete={this.onDeleteGroup}
            />
          );
        })}
      </VerticalGroup>
    );
  }
}
