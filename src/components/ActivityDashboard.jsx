import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale
} from 'chart.js';
import { Radar, Line } from 'react-chartjs-2';
import '../styles/ActivityDashboard.css';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale
);

const TimelineChart = () => {
  const timelineData = {
    labels: ['18:00', '21:00', '00:00', '03:00', '06:00', '09:00', '12:00', '15:00'],
    datasets: [
      {
        label: 'Keypresses',
        data: [1500, 2500, 1000, 500, 200, 1000, 2000, 1500],
        borderColor: 'rgba(255, 255, 150, 0.9)',
        backgroundColor: 'rgba(255, 255, 150, 0.1)',
        borderWidth: 1,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Mouse Movement',
        data: [1200, 2000, 800, 400, 100, 800, 1500, 1200],
        borderColor: 'rgba(100, 150, 255, 0.9)',
        backgroundColor: 'rgba(100, 150, 255, 0.1)',
        borderWidth: 1,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Middle Clicks',
        data: [800, 1500, 600, 300, 50, 600, 1200, 900],
        borderColor: 'rgba(150, 255, 150, 0.9)',
        backgroundColor: 'rgba(150, 255, 150, 0.1)',
        borderWidth: 1,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Right Clicks',
        data: [1000, 1800, 700, 350, 75, 700, 1400, 1100],
        borderColor: 'rgba(200, 150, 255, 0.9)',
        backgroundColor: 'rgba(200, 150, 255, 0.1)',
        borderWidth: 1,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Left Clicks',
        data: [900, 1700, 650, 325, 60, 650, 1300, 1000],
        borderColor: 'rgba(255, 255, 255, 0.9)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const timelineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        align: 'start',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: "'JetBrains Mono', monospace",
            size: window.innerWidth <= 768 ? 8 : 10
          },
          boxWidth: window.innerWidth <= 768 ? 8 : 12,
          padding: window.innerWidth <= 768 ? 3 : 10
        }
      },
      tooltip: {
        enabled: false
      }
    },
    scales: {
      y: {
        position: 'left',
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          display: true,
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: "'JetBrains Mono', monospace",
            size: window.innerWidth <= 768 ? 8 : 10
          },
          callback: function(value) {
            if (value === 0) return '0';
            if (value === 500) return '500';
            if (value === 1000) return '1k';
            if (value === 2000) return '2k';
            if (value === 3000) return '3k';
            return '';
          }
        },
        min: 0,
        max: 3000,
        beginAtZero: true
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          font: {
            family: "'JetBrains Mono', monospace",
            size: window.innerWidth <= 768 ? 8 : 10
          },
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    layout: {
      padding: {
        left: 0,
        right: window.innerWidth <= 768 ? 5 : 10,
        top: window.innerWidth <= 768 ? 5 : 10,
        bottom: window.innerWidth <= 768 ? 40 : 20
      }
    }
  };

  return (
    <div className="timeline-chart">
      <Line data={timelineData} options={timelineOptions} />
    </div>
  );
};

const ActivityDashboard = () => {
  const activityData = {
    leftClicks: 1170000,
    rightClicks: 3100000,
    middleClicks: 20000,
    keypresses: 3380000,
    mouseMovement: 1800000
  };

  const activityBreakdown = {
    leagueOfLegends: 43,
    youtube: 20,
    discord: 20,
    anime: 6,
    research: 7,
    other: 4
  };

  const focusDistribution = {
    leagueOfLegends: 433,
    discord: 243,
    youtube: 179,
    research: 118,
    anime: 83,
    other: 150
  };

  const radarData = {
    labels: Object.keys(focusDistribution).map(key => key.replace(/([A-Z])/g, ' $1').toLowerCase()),
    datasets: [{
      data: Object.values(focusDistribution),
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.7)',
      pointBackgroundColor: 'rgba(255, 255, 255, 1)',
      borderWidth: 1,
      fill: true
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.5)',
          font: {
            family: "'JetBrains Mono', monospace",
            size: 10
          }
        },
        ticks: {
          display: false,
          stepSize: 100
        },
        suggestedMin: 0,
        suggestedMax: 500
      }
    }
  };

  const avgDailyActivity = [
    { day: "Sun", leftClicks: "4206", rightClicks: "14507", middleClicks: "71", keypresses: "22716", mouseMovement: "7537" },
    { day: "Mon", leftClicks: "5010", rightClicks: "13723", middleClicks: "102", keypresses: "15441", mouseMovement: "8423" },
    { day: "Tue", leftClicks: "5649", rightClicks: "14217", middleClicks: "89", keypresses: "15822", mouseMovement: "8304" },
    { day: "Wed", leftClicks: "5957", rightClicks: "14459", middleClicks: "102", keypresses: "16400", mouseMovement: "7743" },
    { day: "Thu", leftClicks: "5121", rightClicks: "8512", middleClicks: "86", keypresses: "15176", mouseMovement: "6637" },
    { day: "Fri", leftClicks: "5239", rightClicks: "15447", middleClicks: "96", keypresses: "16335", mouseMovement: "8440" },
    { day: "Sat", leftClicks: "4593", rightClicks: "19375", middleClicks: "80", keypresses: "15165", mouseMovement: "9179" }
  ];

  return (
    <div className="dashboard-container">
      <div className="activity-section">
        <h2>my activity</h2>
        <div className="charts-row">
          <div className="chart-container">
            <div className="chart-label"></div>
            <Radar data={radarData} options={chartOptions} />
          </div>
        </div>
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-label">Left Clicks</span>
            <span className="stat-value">1.17m</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Right Clicks</span>
            <span className="stat-value">3.10m</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Middle Clicks</span>
            <span className="stat-value">20k</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Keypresses</span>
            <span className="stat-value">3.38m</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Mouse Movement</span>
            <span className="stat-value">1.80m feet</span>
          </div>
        </div>
        
        <div className="timeline-section">
          <TimelineChart />
        </div>

        <div className="activity-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Left Clicks</th>
                <th>Right Clicks</th>
                <th>Middle Clicks</th>
                <th>Keypresses</th>
                <th>Mouse Movement</th>
              </tr>
            </thead>
            <tbody>
              {avgDailyActivity.map((row, index) => (
                <tr key={index}>
                  <td>{row.day}</td>
                  <td>{row.leftClicks}</td>
                  <td>{row.rightClicks}</td>
                  <td>{row.middleClicks}</td>
                  <td>{row.keypresses}</td>
                  <td>{row.mouseMovement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ActivityDashboard; 