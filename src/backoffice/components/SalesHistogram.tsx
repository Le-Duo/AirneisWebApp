import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const SalesHistogram = ({ salesData }: { salesData: any }) => {
  const data = {
    labels: salesData.map((data: any) => data.date),
    datasets: [
      {
        label: 'Ventes Totales',
        data: salesData.map((data: any) => data.totalSales),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  }

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return <Bar data={data} options={options} />
}

export default SalesHistogram
