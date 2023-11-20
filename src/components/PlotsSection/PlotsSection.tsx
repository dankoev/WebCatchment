import { FC } from "react"
import { PlotsSectionsProps } from "./PlotsSection.props"
import LinesPlot from "../LinesPlot/LinesPlot"
import { LineColors, PointColors } from "../LinesPlot/LinesPlot.enums"
import { SimDataColumn } from "../../api/SimDataService.models"
import styles from "./PlotSection.module.css"

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
  arr: SimDataColumn[],
  aliases: string[],
  heapSize: number | undefined
): Array<Array<[SimDataColumn, string | undefined]>> {
  const arrAlias: [number, SimDataColumn, string | undefined][] = arr.map(
    (el, i) => [i, el, aliases[i]]
  )
  const result = arrAlias.reduce<ReturnType<typeof transformIntoHeap>>(
    (acc, [i, ...data]) => {
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
  aliases,
  mergeNumber
}) => {
  const { periodStart, periodEnd, columns } = plotsData

  const heapsColumns = transformIntoHeap(columns, aliases, mergeNumber)
  const labels = getArrayDates(periodStart, periodEnd)
  return (
    <section className={styles.section}>
      {heapsColumns.map((heap, index) => (
        <LinesPlot
          className={styles.plot}
          key={index}
          data={{
            labels,
            datasets: heap.map(([plotData, plotAlias], i) => ({
              label: plotAlias ?? plotData.name,
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
