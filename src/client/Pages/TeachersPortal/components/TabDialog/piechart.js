import React, { Component } from 'react';
import { observer } from 'mobx-react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

export default observer(class Piechart extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    let chart = am4core.create("chartdiv", am4charts.PieChart3D);
    chart.hiddenState.properties.opacity = 0;
    chart.data = this.props.data;

    chart.innerRadius = am4core.percent(40);
    chart.depth = 120;

    chart.legend = new am4charts.Legend();

    let series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "sum_seconds";
    series.dataFields.depthValue = "sum_seconds";
    series.dataFields.category = "block_type";
    series.slices.template.cornerRadius = 5;
    series.colors.step = 3;
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    return (
      <div id="chartdiv" ></div>
    )
  }
});
