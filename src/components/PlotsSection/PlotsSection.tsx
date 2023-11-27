import { FC } from "react"
import { PlotsSectionsProps } from "./PlotsSection.props"
import { SimDataColumn } from "../../api/SimDataService.models"
import styles from "./PlotSection.module.css"
import MixChart from "../MixChart/MixChart"
import { LineColors, PointColors } from "../MixChart/MixChart.enums"

function getArrayDates(periodStart: string, periodEnd: string) {
  let mutDate = new Date(periodStart)
  let dateEnd = new Date(periodEnd)
  dateEnd.setDate(dateEnd.getDate())

  if (+mutDate > +dateEnd) {
    ;[dateEnd, mutDate] = [mutDate, dateEnd]
  }
  const datesArray = []
  while (+mutDate <= +dateEnd) {
    datesArray.push(mutDate.toISOString().slice(0, 10))
    mutDate.setDate(mutDate.getDate() + 1)
  }
  return datesArray
}

function transformIntoHeap(
  plotData: SimDataColumn[],
  columnsOption: [string, "bar" | "line"][],
  heapSize: number | undefined
): [SimDataColumn, string | undefined, "bar" | "line"][][] {
  const colsWithOptions = plotData.map<
    [SimDataColumn, string | undefined, "bar" | "line"]
  >((el, i) => [el, ...columnsOption[i]])
  const result = colsWithOptions.reduce<ReturnType<typeof transformIntoHeap>>(
    (acc, data, i) => {
      const pos = Math.floor(i / (heapSize ?? 1))
      acc[pos] ??= []
      acc[pos].push(data)
      return acc
    },
    []
  )
  return result
}

const PlotsSection: FC<PlotsSectionsProps> = ({
  plotsData,
  colsOption,
  mergeNumber
}) => {
  const { periodStart, periodEnd, columns } = plotsData

  const heapsColumns = transformIntoHeap(columns, colsOption, mergeNumber)
  const labels = getArrayDates(periodStart, periodEnd)
  return (
    <section className={styles.section}>
      {heapsColumns.map((heap, index) => (
        <MixChart
          className={styles.plot}
          key={index}
          data={{
            labels,
            datasets: heap.map(([plotData, plotAlias, type], i) => ({
              label: plotAlias ?? plotData.name,
              type: type,
              data: plotData.values,
              borderColor: Object.values(LineColors)[i],
              backgroundColor: Object.values(PointColors)[i]
            }))
          }}
        />
      ))}
    </section>
  )
}

export default PlotsSection
