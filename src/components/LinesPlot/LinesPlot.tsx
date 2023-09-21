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
import classes from "./Plot.module.css"
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

const LinesPlot: FC<LinesPlotProps> = ({ title, data }) => {
  return (
    <div className={classes.linePlot}>
      <Line
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: data.datasets.length > 1,
              position: "right"
            },
            title: {
              display: true,
              text: title ?? "Unknown"
            }
          }
        }}
        data={data}
      />
    </div>
  )
}

export default LinesPlot
