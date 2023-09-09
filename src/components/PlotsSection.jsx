import LinesPlot from "./UI/LinesPlot"

const PlotsSection = () => {
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July"
  ]
  const datasetsT = [
    {
      data: [10, 0, 8, 7, 36, 6, 7],
      borderColor: "rgb(53, 10, 235)",
      backgroundColor: "rgba(0, 0, 0, 0.5)"
    }
  ]
  const datasetsC = [
    {
      data: [1, 3, 7, 7, 20, 5, 7],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)"
    }
  ]
  return (
    <section className="plots">
      <LinesPlot data={{ labels, datasets: datasetsT }} />
      <LinesPlot title="C" data={{ labels, datasets: datasetsC }} />
    </section>
  )
}

export default PlotsSection
