import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineController,
  BarController
} from "chart.js"
import { Chart, ChartProps } from "react-chartjs-2"
import { FC } from "react"
import { MixChartProps } from "./MixChart.props"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  BarController
)

const MixChart: FC<MixChartProps> = ({ title, data, className }) => {
  const options: ChartProps["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const
      },
      title: {
        display: true,
        text: title ?? ""
      }
    }
  }
  return (
    <div className={className}>
      <Chart type="line" options={options} data={data} />
    </div>
  )
}

export default MixChart
