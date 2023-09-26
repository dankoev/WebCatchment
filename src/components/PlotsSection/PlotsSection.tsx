import { FC } from "react"
import { PlotsSectionsProps } from "./PlotsSection.props"
import LinesPlot from "../LinesPlot/LinesPlot"
import { LineColors, PointColors } from "../LinesPlot/LinesPlot.enums"
import { SimDataColumn } from "../../api/SimDataService.models"

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
  console.log(heapsColumns)
  return (
    <section className="plots">
      {heapsColumns.map((heap, index) => (
        <LinesPlot
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
