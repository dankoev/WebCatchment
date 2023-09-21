import DataForm from "./DataForm"
import PlotsSection from "./PlotsSection"
// import { useCatchmentData } from "../hooks/useSimdata"
import SimdataService from "../api/SimdataService.js"
import { useEffect, useState } from "react"

const initialSimData = {
  periodStart: "1981-10-10",
  periodEnd: "1981-10-14",
  location: "",
  columnsNames: ["Qobs","Qsim", "Temperature", "Precipitation"]
}

const UpdatedPlots = () => {
  const [plotData, setPlotData] = useState("")

  const updatePlotData = (inputData) => {
    SimdataService.getData(inputData)
      .then(res => setPlotData(res))
      .catch(err => console.log(err.message))
  }

  useEffect(() => {
    console.log('effect')
    updatePlotData(initialSimData)
  }, [])

  const updateDataHandle = inputData => {
    updatePlotData({ ...inputData, columnsNames: initialSimData.columnsNames })
  }
  console.log(plotData)
  const { columns, periodStart, periodEnd } = plotData
  return (
    <section>
      <DataForm startDefaultDate={periodStart} endDefaultDate={periodEnd} updateDataEvent={updateDataHandle} />
      {columns ? (
        <PlotsSection
          periodStart={periodStart}
          periodEnd={periodEnd}
          columns={columns}
        />
      ) : (
        ""
      )}
    </section>
  )
}

export default UpdatedPlots
/*
 *
      <PlotsSection
        periodStart={periodStart}
        periodEnd={periodEnd}
        columns={columns}
      />
 * */
