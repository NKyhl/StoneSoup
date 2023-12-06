import { Line } from 'react-chartjs-2';
// eslint-disable-next-line no-unused-vars
import Chart from 'chart.js/auto';

function Charts({ userData, setUserData }) {

    const dataCal = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Calories',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [1401, 2100, 1900, 1600, 1800, 2500, 1700],
          },
          {
            data: new Array(7).fill(userData.cal_goal),
            borderColor: 'rgba(255,99,132,1)',
            backgroundColor: 'rgba(255,99,132,0.2)',
            pointRadius: 0,
          }
        ],
      };

      const dataCarb = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Calories',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [200, 240, 230, 205, 300, 310, 280],
          },
          {
            data: new Array(7).fill(userData.carb_goal),
            borderColor: 'rgba(255,99,132,1)',
            backgroundColor: 'rgba(255,99,132,0.2)',
            pointRadius: 0,
          }
        ],
      };
    
      const dataProtein = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Calories',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [50, 80, 70, 90, 85, 80, 85],
          },
          {
            data: new Array(7).fill(userData.protein_goal),
            borderColor: 'rgba(255,99,132,1)',
            backgroundColor: 'rgba(255,99,132,0.2)',
            pointRadius: 0,
          }
        ],
      };

      const dataFat = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Calories',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [40, 30, 60, 50, 45, 50, 40],
          },
          {
            data: new Array(7).fill(userData.fat_goal),
            borderColor: 'rgba(255,99,132,1)',
            backgroundColor: 'rgba(255,99,132,0.2)',
            pointRadius: 0,
          }
        ],
      };

  const chartOptionsCal = {
    plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Calories',
          font: {
            size: 16,
          },
        },
      },
  };

  const chartOptionsCarb = {
    plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Carb',
          font: {
            size: 16,
          },
        },
      },
  };

  const chartOptionsProtein = {
    plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Protein',
          font: {
            size: 16,
          },
        },
      },
  };

  const chartOptionsFat = {
    plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Fat',
          font: {
            size: 16,
          },
        },
      },
  };

  return (
    <div className='chart-container'>
        <div className='little-chart-container'>
            <div style={{ width: '500px', height: '250px' }}>
                <Line data={dataCal} options={chartOptionsCal}></Line>
            </div>
            <div style={{ width: '500px', height: '250px' }}>
                <Line data={dataCarb} options={chartOptionsCarb}></Line>
            </div> 
        </div>
        <div className='little-chart-container'>
            <div style={{ width: '500px', height: '250px' }}>
                <Line data={dataProtein} options={chartOptionsProtein}></Line>
            </div>
            <div style={{ width: '500px', height: '250px' }}>
                <Line data={dataFat} options={chartOptionsFat}></Line>
            </div>
        </div>
    </div>
  )
}

export default Charts;
