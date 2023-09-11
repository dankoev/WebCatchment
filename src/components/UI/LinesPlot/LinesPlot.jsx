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
import PropTypes from "prop-types"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const LinesPlot = ({ title, data: { labels, datasets } }) => {
  const data = {
    labels,
    datasets
  }
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: datasets.length > 1,
        position: "right"
      },
      title: {
        display: true,
        text: title ?? "Unknown"
      }
    }
  }

  return (
    <div className={classes.linePlot}>
      <Line options={options} data={data} />
    </div>
  )
}

LinesPlot.propTypes = {
  title: PropTypes.string,
  data: PropTypes.shape({
    labels: PropTypes.array,
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        data: PropTypes.arrayOf(PropTypes.number),
        borderColor: PropTypes.string,
        backgroundColor: PropTypes.string
      })
    )
  })
}

export default LinesPlot
