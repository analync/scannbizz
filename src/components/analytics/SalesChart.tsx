import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { getDateRangeForPastDays, getDayName, formatCurrency } from '../../utils/dateUtils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SalesData {
  [date: string]: number;
}

interface SalesChartProps {
  salesData: SalesData;
  days?: number;
  chartType?: 'bar' | 'line';
  title?: string;
}

const SalesChart: React.FC<SalesChartProps> = ({
  salesData,
  days = 7,
  chartType = 'bar',
  title = 'Sales Overview'
}) => {
  const [chartData, setChartData] = useState<ChartData<'bar' | 'line'>>({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const dateRange = getDateRangeForPastDays(days);
    const labels = dateRange.map(date => getDayName(date));
    
    const values = dateRange.map(date => salesData[date] || 0);
    
    setChartData({
      labels,
      datasets: [
        {
          label: 'Sales',
          data: values,
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
          tension: 0.3,
        }
      ]
    });
  }, [salesData, days]);

  const options: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        color: document.documentElement.classList.contains('dark') 
          ? 'rgba(255, 255, 255, 0.87)' 
          : 'rgba(0, 0, 0, 0.87)',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `Sales: ${formatCurrency(context.parsed.y)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatCurrency(value as number),
          color: document.documentElement.classList.contains('dark') 
            ? 'rgba(255, 255, 255, 0.6)' 
            : 'rgba(0, 0, 0, 0.6)',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          color: document.documentElement.classList.contains('dark') 
            ? 'rgba(255, 255, 255, 0.6)' 
            : 'rgba(0, 0, 0, 0.6)',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-64">
      {chartType === 'bar' ? (
        <Bar data={chartData} options={options} />
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};

export default SalesChart;