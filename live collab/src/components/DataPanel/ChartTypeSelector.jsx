import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setChartType } from '../../redux/slices/chartSlice';

const CHART_TYPES = [
  { value: 'pie', label: 'Pie Chart' },
  { value: 'bar', label: 'Bar Chart' },
  { value: 'line', label: 'Line Chart' },
  { value: 'histogram', label: 'Histogram' },
];

export default function ChartTypeSelector() {
  const dispatch = useDispatch();
  const chartType = useSelector((state) => state.chart.chartType);

  return (
    <select
      className="chart-type-select"
      value={chartType}
      onChange={(e) => dispatch(setChartType(e.target.value))}
    >
      {CHART_TYPES.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
