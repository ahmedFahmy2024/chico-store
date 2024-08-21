import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';

function ApexChartLine2({ charts }) {
  // console.log(charts);
  const theme = useTheme();

  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'orderTotalByMonth',
        data: []
      }
    ],
    options: {
      chart: {
        toolbar: {
          show: false
        }
      },
      markers: {
        size: 1
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'category',
        categories: []
      },
      yaxis: {},
      grid: {
        show: true,
        strokeDashArray: 4
      },
      tooltip: {
        x: {
          format: 'MMM'
        },
        y: {
          formatter: function(value) {
            return `$${value}`;
          }
        }
      }
    }
  });

  useEffect(() => {
    if (charts && charts.orderCountByMonth) {
      const months = Object.keys(charts.orderCountByMonth);
      const values = Object.values(charts.orderCountByMonth).map(value => parseFloat(value) || 0);

      const seriesData = months.map((month, index) => ({
        x: month,
        y: values[index]
      }));

      setChartData({
        series: [
          {
            name: 'Transaction Amount',
            data: seriesData
          }
        ],
        options: {
          ...chartData.options,
          xaxis: {
            ...chartData.options.xaxis,
            categories: months
          }
        }
      });
    }
  }, [charts]);

  if (!charts || !charts.orderCountByMonth) {
    return <div>Loading...</div>;
  }

  return (
    <div className={theme.palette.mode === 'light' ? 'light' : 'dark'}>
      <div id="chart">
        <ReactApexChart options={chartData.options} series={chartData.series} type="line" height="364" width="100%" className="hello-linechart" />
      </div>
      <div id="html-dist"></div>
    </div>
  );
}

export default ApexChartLine2;

// import React, { useEffect, useState } from 'react';
// import ReactApexChart from 'react-apexcharts';
// import { useTheme } from '@mui/material/styles';

// function ApexChartLine2({ charts }) {

//  // Ensure charts and transaction_amount_by_month are defined
//  const months = charts?.orderCountByMonth ? Object.keys(charts.orderCountByMonth) : [];
//  const values = charts?.orderCountByMonth ? Object.values(charts.orderCountByMonth) : [];

//     // Mapping data into the required format for ApexCharts
//     const seriesData = months.map((month, index) => ({
//       x: month,
//       y: parseFloat(values[index]) || 0
//     }));

//     const theme = useTheme({});
//     const [chartData, setChartData] = useState({
//       series: [
//         {
//           name: 'Orders Count By Month',
//           data: seriesData
//         }
//       ],
//       options: {
//         chart: {
//           height: 350,
//           type: 'line'
//         },
//         dataLabels: {
//           enabled: false
//         },
//         stroke: {
//           curve: 'smooth'
//         },
//         xaxis: {
//           type: 'category',
//           categories: months
//         },
//         tooltip: {
//           x: {
//             format: 'MMM'
//           },
//           y: {
//             formatter: function(value) {
//               return `${value} Orders`;
//             }
//           }
//         }
//       }
//     });
//   return (
//     <div className={theme.palette.mode === 'light' ? 'light' : 'dark'}>
//       <div id="chart">
//         <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={300} />
//       </div>
//       <div id="html-dist"></div>
//     </div>
//   )
// }

// export default ApexChartLine2