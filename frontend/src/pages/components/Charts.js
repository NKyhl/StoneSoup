import { Line } from 'react-chartjs-2';
// eslint-disable-next-line no-unused-vars
import Chart from 'chart.js/auto';
import { useEffect, useState } from 'react';

function Charts({ userData, setUserData }) {

  const [labelArray, setLabelArray] = useState([]);
  const [calArray, setCalArray] = useState([]);
  const [proteinArray, setProteinArray] = useState([]);
  const [fatArray, setFatArray] = useState([]);
  const [carbArray, setCarbArray] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = {
        user_id: userData["id"],
      }
  
      const res = await fetch('/api/get/user-history', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
  
      if(!res.ok){
          return;
      }
    
      const res_json = await res.json();

      const carb = res_json["weeks"].map(obj => obj["carbs"] / 7);
      const protein = res_json["weeks"].map(obj => obj["protein"] / 7);
      const fat = res_json["weeks"].map(obj => obj["fat"] / 7);
      const cal = res_json["weeks"].map(obj => obj["calories"] / 7);
      const label = res_json["weeks"].map(obj => obj["start_date"]);

      setLabelArray(label);
      setCalArray(cal);
      setProteinArray(protein);
      setFatArray(fat);
      setCarbArray(carb);
    
    }
    
    fetchData();

  }, []);

    const dataCal = {
        labels: labelArray,
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
            data: calArray,
          },
          {
            data: new Array(labelArray.length).fill(userData.cal_goal),
            borderColor: 'rgba(255,99,132,1)',
            backgroundColor: 'rgba(255,99,132,0.2)',
            pointRadius: 0,
          }
        ],
      };

      const dataCarb = {
        labels: labelArray,
        datasets: [
          {
            label: 'carb',
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
            data: carbArray,
          },
          {
            data: new Array(labelArray.length).fill(userData.carb_goal),
            borderColor: 'rgba(255,99,132,1)',
            backgroundColor: 'rgba(255,99,132,0.2)',
            pointRadius: 0,
          }
        ],
      };
    
      const dataProtein = {
        labels: labelArray,
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
            data: proteinArray,
          },
          {
            data: new Array(labelArray.length).fill(userData.protein_goal),
            borderColor: 'rgba(255,99,132,1)',
            backgroundColor: 'rgba(255,99,132,0.2)',
            pointRadius: 0,
          }
        ],
      };

      const dataFat = {
        labels: labelArray,
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
            data: fatArray,
          },
          {
            data: new Array(labelArray.length).fill(userData.fat_goal),
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
          text: 'Average Daily Calories',
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
          text: 'Average Daily Carbs',
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
          text: 'Average Daily Protein',
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
          text: 'Average Daily Fat',
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
