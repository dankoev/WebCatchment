import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"
import { Line } from "react-chartjs-2"
import { FC } from "react"
import { LinesPlotProps } from "./LinesPlot.props"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const LinesPlot: FC<LinesPlotProps> = ({ title, data, className }) => {
  return (
    <div>
      <Line
        className={className}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top"
            },
            title: {
              display: true,
              text: title ?? ""
            }
          }
        }}
        data={data}
      />
    </div>
  )
}

export default LinesPlot
