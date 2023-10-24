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
    [dateEnd, mutDate] = [mutDate, dateEnd]
  }
  const datesArray = []
  while (+mutDate <= +dateEnd) {
    datesArray.push(mutDate.toISOString().slice(0, 10))
    mutDate.setDate(mutDate.getDate() + 1)
  }
  return datesArray
}

function transformIntoHeap(
  arr: Array<SimDataColumn>,
  heapSize: number | undefined
): Array<Array<SimDataColumn>> {
  const arrCopy = [...arr]
  const resultArr: Array<Array<SimDataColumn>> = []

  while (arrCopy.length !== 0) {
    resultArr.push(arrCopy.splice(0, heapSize ?? 1))
  }
  return resultArr
}

const PlotsSection: FC<PlotsSectionsProps> = ({ plotsData, mergeNumber }) => {
  const { periodStart, periodEnd, columns } = plotsData

  const heapsColumns = transformIntoHeap(columns, mergeNumber)
  const labels = getArrayDates(periodStart, periodEnd)
  return (
    <section className={styles.section}>
      {heapsColumns.map((heap, index) => (
        <LinesPlot
          className={styles.plot}
          key={index}
          data={{
            labels,
            datasets: heap.map((lineData, i) => {
              return {
                label: lineData.name,
                data: lineData.values,
                borderColor: Object.values(LineColors)[i],
                backgroundColor: Object.values(PointColors)[i]
              }
            })
          }}
        />
      ))}
    </section>
  )
}

export default PlotsSection
