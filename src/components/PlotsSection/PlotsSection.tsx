import { FC } from "react"
import { PlotsSectionsProps } from "./PlotsSection.props"
import LinesPlot from "../LinesPlot/LinesPlot"

function getArrayDates(periodStart: string, periodEnd: string) {
  const mutDate = new Date(periodStart)
  const dateEnd = new Date(periodEnd)
  dateEnd.setDate(dateEnd.getDate() + 1)
  const datesArray = []
  while (+mutDate !== +dateEnd) {
    datesArray.push(mutDate.toLocaleDateString("ru-ru").split(".").join("-"))
    mutDate.setDate(mutDate.getDate() + 1)
  }
  return datesArray
}

const PlotsSection: FC<PlotsSectionsProps> = ({
  periodStart,
  periodEnd,
  columns
}) => {
  getArrayDates(periodStart, periodEnd)
  const labels = getArrayDates(periodStart, periodEnd)

  return (
    <section className="plots">
      {columns.map(column => (
        <LinesPlot
          title={column.name}
          key={column.name}
          data={{
            labels,
            datasets: [
              {
                data: column.values,
                borderColor: "rgb(53, 162, 235)",
                backgroundColor: "rgba(53, 162, 235, 0.5)"
              }
            ]
          }}
        />
      ))}
    </section>
  )
}

export default PlotsSection
