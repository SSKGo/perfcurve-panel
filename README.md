# Grafana Plugin PerfCurve

## Overview
PerfCurve is a grafana panel plugin to plot operation point of rotating machine, such as pump, compressor and etc., on a canvas with its performance curves.
You can draw multiple performance curves on the canvas only by giving sample points on the performance curve. The panel plugin connects sample points smoothly.

![Panel Example](https://github.com/SSKGo/perfcurve-panel/blob/master/docs/img/panel_example.png "Panel Example")

## Getting started
### Axes
Specify Min., Max., Label, Unit and Decimals of X-axis amd Y-axis.

![Axes](https://github.com/SSKGo/perfcurve-panel/blob/master/docs/img/axes_setting.png "Axes")

### Static curve
Add performance curves to the canvas by specifying sample points in comma separated value format.  
The number of values in X input box and Y input Box shall be same.
Natural curves are drawn based on the sample points.

![Static curve](https://github.com/SSKGo/perfcurve-panel/blob/master/docs/img/static_curve_setting.png "Static curve")

### Dynamic curve (Advanced)
In case performance curve data is availble in database, they can be used to draw peformance curve which dynamically move based on the data. 

![Dynamic curve](https://github.com/SSKGo/perfcurve-panel/blob/master/docs/img/dynamic_curve_setting.png "Dynamic curve")
![Query for dynamic curve](https://github.com/SSKGo/perfcurve-panel/blob/master/docs/img/query_dynamic_curve.png "Query for dynamic curve")

### Operation points
Set field names for X box and Y box to plot operating points.
Set Label, Color and Point Radius, too.  
Table format is recommended as query option.

![Operation points](https://github.com/SSKGo/perfcurve-panel/blob/master/docs/img/plot_setting.png "Operation points")
![Query example](https://github.com/SSKGo/perfcurve-panel/blob/master/docs/img/query_example.png "Query example")

