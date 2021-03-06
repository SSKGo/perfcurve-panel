# Grafana Plugin PerfCurve

## Overview
PerfCurve is a grafana panel plugin to plot operation point of rotating machine, such as pump, compressor and etc., on a canvas with its performance curves.
You can draw multiple performance curves on the canvas only by giving sample points on the performance curve. The panel plugin connects sample points smoothly.

![Panel Example](https://raw.githubusercontent.com/SSKGo/perfcurve-panel/master/docs/img/panel_example.png "Panel Example")

## Important notes !!
Select the plugin version in accordance with the following rule.
- For Grafana \<= 7.3.X, use version \<= 1.3.X
- For Grafana \>= 7.4.X, use version \>= 1.4.X

## Getting started
### Axes
Specify Min., Max., Label, Unit and Decimals of X-axis amd Y-axis.

![Axes](https://raw.githubusercontent.com/SSKGo/perfcurve-panel/master/docs/img/axes_setting.png "Axes")

### Static curve
Add performance curves to the canvas by specifying sample points in comma separated value format.  
The number of values in X input box and Y input Box shall be same.
Natural curves are drawn based on the sample points.

![Static curve](https://raw.githubusercontent.com/SSKGo/perfcurve-panel/master/docs/img/static_curve_setting.png "Static curve")

### Dynamic curve (Advanced)
In case performance curve data is availble in database, they can be used to draw peformance curve which dynamically move based on the data. (Example of query is written for InfluxDB datasource.)

![Dynamic curve](https://raw.githubusercontent.com/SSKGo/perfcurve-panel/master/docs/img/dynamic_curve_setting.png "Dynamic curve")
![Query for dynamic curve](https://raw.githubusercontent.com/SSKGo/perfcurve-panel/master/docs/img/query_dynamic_curve.png "Query for dynamic curve")

### Operation points
Set field names for X box and Y box to plot operating points.
Set Label, Color and Point Radius, too.  
Table format is recommended as query option.

![Operation points](https://raw.githubusercontent.com/SSKGo/perfcurve-panel/master/docs/img/plot_setting.png "Operation points")
![Query example](https://raw.githubusercontent.com/SSKGo/perfcurve-panel/master/docs/img/query_example.png "Query example")

