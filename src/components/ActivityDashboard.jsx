import React, { useState, useEffect, useMemo } from 'react';
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

const TimelineChart = ({ data }) => {
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
      <Line data={data} options={timelineOptions} />
    </div>
  );
};

const ActivityDashboard = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Try to fetch from Netlify function first
        const response = await fetch('/.netlify/functions/get-metrics');
        
        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        } else {
          // Fallback to local API if Netlify function fails
          const localResponse = await fetch('http://localhost:5000/metrics');
          const localData = await localResponse.json();
          setMetrics(localData);
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
        
        // Try local API as fallback
        try {
          const localResponse = await fetch('http://localhost:5000/metrics');
          const localData = await localResponse.json();
          setMetrics(localData);
        } catch (localError) {
          console.error('Failed to fetch from local API:', localError);
        }
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000); // Fetch every minute
    return () => clearInterval(interval);
  }, []);

  // Use metrics data if available, otherwise fallback to dummy data
  const activityData = useMemo(() => {
    if (!metrics) return { leftClicks: 0, rightClicks: 0, middleClicks: 0, keypresses: 0, mouseMovement: 0 };
    
    return {
      leftClicks: metrics.mouse_clicks.left || 0,
      rightClicks: metrics.mouse_clicks.right || 0,
      middleClicks: metrics.mouse_clicks.middle || 0,
      keypresses: metrics.keypresses || 0,
      mouseMovement: metrics.mouse_movement || 0
    };
  }, [metrics]);

  // Get the latest app usage data for radar chart
  const radarData = useMemo(() => {
    if (!metrics || !metrics.hourly_data || metrics.hourly_data.length === 0) {
      return {
        labels: ['No data available'],
        datasets: [{
          data: [0],
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.7)',
          pointBackgroundColor: 'rgba(255, 255, 255, 1)',
          borderWidth: 1,
          fill: true
        }]
      };
    }

    // Get the latest hourly data entry
    const latestData = metrics.hourly_data[metrics.hourly_data.length - 1];
    
    // If no top_apps data, use dummy data for testing
    if (!latestData.top_apps || Object.keys(latestData.top_apps).length === 0) {
      console.log("No app data found, using fallback data");
      const fallbackApps = {
        "chrome.exe": 25,
        "code.exe": 15,
        "explorer.exe": 10,
        "node.exe": 8,
        "python.exe": 5,
        "spotify.exe": 3
      };
      
      // Format app names for display
      const formattedLabels = Object.keys(fallbackApps).map(app => 
        formatAppName(app)
      );
      
      return {
        labels: formattedLabels,
        datasets: [{
          data: Object.values(fallbackApps),
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.7)',
          pointBackgroundColor: 'rgba(255, 255, 255, 1)',
          borderWidth: 1,
          fill: true
        }]
      };
    }
    
    const topApps = latestData.top_apps;
    console.log("Found app data:", topApps);
    
    // Format app names for display
    const formattedLabels = Object.keys(topApps).map(app => formatAppName(app));
    
    // Get app usage values
    const appValues = Object.values(topApps);
    
    return {
      labels: formattedLabels,
      datasets: [{
        data: appValues,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.7)',
        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 1,
        fill: true
      }]
    };
  }, [metrics]);

  // Calculate daily averages from hourly data
  const avgDailyActivity = useMemo(() => {
    if (!metrics) {
      return {};
    }

    // Get current day of week
    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    
    // Create an object with all days of the week
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.reduce((acc, day) => {
      // Only show data for the current day
      if (day === currentDay) {
        acc[day] = {
          leftClicks: metrics.mouse_clicks.left || 0,
          rightClicks: metrics.mouse_clicks.right || 0,
          middleClicks: metrics.mouse_clicks.middle || 0,
          keypresses: metrics.keypresses || 0,
          mouseMovement: metrics.mouse_movement || 0
        };
      } else {
        // Use null for other days to display as "-"
        acc[day] = {
          leftClicks: null,
          rightClicks: null,
          middleClicks: null,
          keypresses: null,
          mouseMovement: null
        };
      }
      return acc;
    }, {});
  }, [metrics]);

  // Convert to array and format numbers
  const sortedDailyActivity = useMemo(() => {
    const formattedArray = Object.entries(avgDailyActivity).map(([day, data]) => ({
      day,
      leftClicks: data.leftClicks !== null ? formatNumber(data.leftClicks) : "-",
      rightClicks: data.rightClicks !== null ? formatNumber(data.rightClicks) : "-",
      middleClicks: data.middleClicks !== null ? formatNumber(data.middleClicks) : "-",
      keypresses: data.keypresses !== null ? formatNumber(data.keypresses) : "-",
      mouseMovement: data.mouseMovement !== null ? formatNumber(data.mouseMovement) : "-"
    }));

    // Sort by days of week
    const daysOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return formattedArray.sort((a, b) => 
      daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day)
    );
  }, [avgDailyActivity]);

  // Format the hourly data for the timeline
  const timelineData = {
    labels: metrics?.hourly_data.map(data => 
      new Date(data.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    ) || [],
    datasets: [
      {
        label: 'Keypresses',
        data: metrics?.hourly_data.map(data => data.keypresses) || [],
        borderColor: 'rgba(255, 255, 150, 0.9)',
        backgroundColor: 'rgba(255, 255, 150, 0.1)',
        borderWidth: 1,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Mouse Movement',
        data: metrics?.hourly_data.map(data => data.mouse_movement) || [],
        borderColor: 'rgba(100, 150, 255, 0.9)',
        backgroundColor: 'rgba(100, 150, 255, 0.1)',
        borderWidth: 1,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Middle Clicks',
        data: metrics?.hourly_data.map(data => data.mouse_clicks.middle) || [],
        borderColor: 'rgba(150, 255, 150, 0.9)',
        backgroundColor: 'rgba(150, 255, 150, 0.1)',
        borderWidth: 1,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Right Clicks',
        data: metrics?.hourly_data.map(data => data.mouse_clicks.right) || [],
        borderColor: 'rgba(200, 150, 255, 0.9)',
        backgroundColor: 'rgba(200, 150, 255, 0.1)',
        borderWidth: 1,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Left Clicks',
        data: metrics?.hourly_data.map(data => data.mouse_clicks.left) || [],
        borderColor: 'rgba(255, 255, 255, 0.9)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        tension: 0.4,
        fill: true,
      }
    ]
  };

  // Get the latest app usage data
  const latestAppUsage = metrics?.hourly_data[metrics.hourly_data.length - 1]?.top_apps || {};
  const totalUsage = Object.values(latestAppUsage).reduce((a, b) => a + b, 0);
  
  const activityBreakdown = Object.fromEntries(
    Object.entries(latestAppUsage).map(([app, usage]) => [
      app,
      Math.round((usage / totalUsage) * 100)
    ])
  );

  // Update chart options to handle time-based data
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw.toFixed(1)} min`;
          }
        }
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
          stepSize: 10
        },
        suggestedMin: 0,
        suggestedMax: 60  // Max 60 minutes (1 hour)
      }
    }
  };

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
            <span className="stat-value">{formatNumber(activityData.leftClicks)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Right Clicks</span>
            <span className="stat-value">{formatNumber(activityData.rightClicks)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Middle Clicks</span>
            <span className="stat-value">{formatNumber(activityData.middleClicks)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Keypresses</span>
            <span className="stat-value">{formatNumber(activityData.keypresses)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Mouse Movement</span>
            <span className="stat-value">{formatNumber(activityData.mouseMovement)} feet</span>
          </div>
        </div>
        
        <div className="timeline-section">
          <TimelineChart data={timelineData} />
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
              {sortedDailyActivity.map((row, index) => (
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

// Helper function to format numbers
const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}m`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  
  // Format decimal numbers (like mouse movement in feet)
  if (num % 1 !== 0) return num.toFixed(1);
  
  return num.toString();
};

// Helper function to format app names
const formatAppName = (appName) => {
  // System processes to filter out
  const systemProcesses = [
    'memcompression',
    'system',
    'registry',
    'smss.exe',
    'csrss.exe',
    'wininit.exe',
    'services.exe',
    'lsass.exe',
    'svchost.exe',
    'dwm.exe',
    'ntoskrnl.exe',
    'winlogon.exe',
    'taskmgr.exe',
    'conhost.exe',
    'runtimebroker.exe',
    'searchindexer.exe',
    'searchui.exe',
    'shellexperiencehost.exe',
    'sihost.exe',
    'startmenuexperiencehost.exe'
  ];
  
  // Check if this is a system process we should filter out
  if (systemProcesses.includes(appName.toLowerCase())) {
    return 'System Process';
  }
  
  // Common app name mappings
  const appNameMap = {
    'cursor.exe': 'VSCode',
    'code.exe': 'VSCode',
    'chrome.exe': 'Chrome',
    'firefox.exe': 'Firefox',
    'msedge.exe': 'Edge',
    'explorer.exe': 'File Explorer',
    'discord.exe': 'Discord',
    'spotify.exe': 'Spotify',
    'slack.exe': 'Slack',
    'teams.exe': 'Teams',
    'outlook.exe': 'Outlook',
    'winword.exe': 'Word',
    'excel.exe': 'Excel',
    'powerpnt.exe': 'PowerPoint',
    'notepad.exe': 'Notepad',
    'cmd.exe': 'Command Prompt',
    'powershell.exe': 'PowerShell',
    'devenv.exe': 'Visual Studio',
    'rider64.exe': 'Rider',
    'idea64.exe': 'IntelliJ IDEA',
    'pycharm64.exe': 'PyCharm',
    'photoshop.exe': 'Photoshop',
    'illustrator.exe': 'Illustrator',
    'steam.exe': 'Steam',
    'league of legends.exe': 'League of Legends',
    'valorant.exe': 'Valorant',
    'fortnite.exe': 'Fortnite'
  };
  
  // Check if we have a friendly name for this app
  if (appNameMap[appName.toLowerCase()]) {
    return appNameMap[appName.toLowerCase()];
  }
  
  // Otherwise format the name
  return appName
    .replace(/\.exe$/, '') // Remove .exe extension
    .replace(/([A-Z])/g, ' $1') // Add spaces before capital letters
    .toLowerCase() // Convert to lowercase
    .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
};

export default ActivityDashboard; 