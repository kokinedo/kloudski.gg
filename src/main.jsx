import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Chart as ChartJS, ArcElement, RadialLinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import './index.css'
import App from './App'

ChartJS.register(
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
) 