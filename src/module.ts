import { PanelPlugin } from '@grafana/data';
import { CanvasOptions } from './types';
import { PerformanceCurvePanel } from './PerformanceCurvePanel';
import { CurveLineForms } from './CurveLineForms';
import { DynamicCurveLineForms } from './DynamicCurveLineForms';
import { PlotSeriesForms } from './PlotSeriesForms';
import { AxisForms } from './AxisForms';
import { getColorFromHexRgbOrName } from '@grafana/data';

export const plugin = new PanelPlugin<CanvasOptions>(PerformanceCurvePanel).setPanelOptions(builder => {
  return builder
    .addCustomEditor({
      category: ['Canvas Setting', 'Axis'],
      id: 'xAxis',
      path: 'xAxis',
      name: 'X-Axis Setting',
      defaultValue: {
        minValue: 0,
        maxValue: 60,
        label: 'Flowrate',
        unit: undefined,
        decimals: undefined,
      },
      editor: AxisForms,
    })
    .addCustomEditor({
      category: ['Canvas Setting', 'Axis'],
      id: 'yAxis',
      path: 'yAxis',
      name: 'Y-Axis Setting',
      defaultValue: {
        minValue: 0,
        maxValue: 100,
        label: 'Pressure',
        unit: undefined,
        decimals: undefined,
      },
      editor: AxisForms,
    })
    .addCustomEditor({
      category: ['Canvas Setting', 'Performance Curve'],
      id: 'performanceCurveData',
      path: 'performanceCurveData',
      name: 'Static Performance Curve Data',
      description: 'Input sample data points of peformance curve. Program automatically draw smooth lines.',
      defaultValue: [
        {
          performCurveX: '10,20,30,40,50',
          performCurveY: '80,78,72,62,48',
          color: getColorFromHexRgbOrName('rgba(136, 136, 136, 0.6)'),
        },
      ],
      editor: CurveLineForms,
    })
    .addCustomEditor({
      category: ['Canvas Setting', 'Performance Curve'],
      id: 'dynamicPerfCurve',
      path: 'dynamicPerfCurve',
      name: 'Dynamic Performance Curve Data',
      description: 'Set filed names to draw dynamic peformance curve. Program automatically draw smooth lines.',
      defaultValue: [],
      editor: DynamicCurveLineForms,
    })

    .addCustomEditor({
      category: ['Plot Setting'],
      id: 'plotSetting',
      path: 'plotSetting',
      name: 'Plot Setting',
      description: 'Set field names of X and Y axis to plot operation points. Set alias in query to set field name.',
      defaultValue: [
        {
          label: 'Label Name',
          xField: 'Field X',
          yField: 'Field Y',
          color: getColorFromHexRgbOrName('rgba(136, 136, 136, 0.6)'),
        },
      ],
      editor: PlotSeriesForms,
    })
    .addSelect({
      category: ['Plot Setting'],
      path: 'pointRadius',
      name: 'Point Radius',
      defaultValue: 2,
      settings: {
        options: [
          {
            label: '0.5',
            value: 0.5,
          },
          {
            label: '1',
            value: 1,
          },
          {
            label: '2',
            value: 2,
          },
          {
            label: '3',
            value: 3,
          },
          {
            label: '4',
            value: 4,
          },
          {
            label: '5',
            value: 5,
          },
          {
            label: '6',
            value: 6,
          },
          {
            label: '7',
            value: 7,
          },
          {
            label: '8',
            value: 8,
          },
          {
            label: '9',
            value: 9,
          },
          {
            label: '10',
            value: 10,
          },
        ],
      },
    });
});
