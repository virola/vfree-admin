/** echarts 图表组件封装 license by http://eleadmin.com */
import EleChart from './src/main';

EleChart.install = function (app) {
  app.component(EleChart.name, EleChart);
};

export default EleChart;
