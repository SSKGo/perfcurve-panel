import React from 'react';
import { PanelOptionsEditorProps } from '@grafana/data';
import { Button, ColorPicker, Tooltip, Input, HorizontalGroup, Label, VerticalGroup } from '@grafana/ui';
import { CurvePoints } from './types';

interface CurveLineFormProps {
  value: CurvePoints;
  index?: number;
  styles?: any;
  onChangeItem?: (a: CurvePoints, b: number) => void | undefined;
  onDelete?: (a: number) => void;
}

class CurveLineForm extends React.PureComponent<CurveLineFormProps> {
  constructor(props: CurveLineFormProps) {
    super(props);
    this.state = { ...props.value };
  }
  render() {
    const { value, index, onChangeItem, onDelete } = this.props;
    return (
      <HorizontalGroup>
        <Label>X</Label>
        <Input
          css=""
          type="text"
          name="performCurveX"
          defaultValue={value.performCurveX}
          onBlur={(e) => {
            const performCurveX = e.currentTarget.value;
            this.setState(() => {
              return { performCurveX: performCurveX };
            });
            onChangeItem && index !== undefined && onChangeItem({ ...value, performCurveX: performCurveX }, index);
          }}
        />
        <Label>Y</Label>
        <Input
          css=""
          type="text"
          name="performCurveY"
          defaultValue={value.performCurveY}
          onBlur={(e) => {
            const performCurveY = e.currentTarget.value;
            this.setState(() => {
              return { performCurveY: performCurveY };
            });
            onChangeItem && index !== undefined && onChangeItem({ ...value, performCurveY: performCurveY }, index);
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
          <Tooltip content="Remove this performance curve." theme={'info'}>
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

export class CurveLineForms extends React.PureComponent<PanelOptionsEditorProps<CurvePoints[]>> {
  onChangeItem = (updatedValue: CurvePoints, index: number) => {
    let newValues = [...this.props.value];
    newValues[index] = updatedValue;
    this.props.onChange(newValues);
  };
  onAdd = (newValue: CurvePoints) => {
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
        <Tooltip content="Add a new performance curve." theme={'info'}>
          <Button
            variant="secondary"
            size="sm"
            icon="plus"
            onClick={() => {
              this.onAdd({
                performCurveX: '',
                performCurveY: '',
                color: 'rgba(136, 136, 136, 0.6)',
              } as CurvePoints);
            }}
          >
            Add
          </Button>
        </Tooltip>
        {curves.map((curve: CurvePoints, index: number) => {
          return (
            <CurveLineForm
              key={index}
              value={curve}
              index={index}
              onChangeItem={this.onChangeItem}
              onDelete={this.onDelete}
              // styles={styles}
            />
          );
        })}
      </VerticalGroup>
    );
  }
}
