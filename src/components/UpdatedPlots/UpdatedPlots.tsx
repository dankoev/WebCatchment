import { useEffect, useState } from "react"
import { FC } from "react"
import { SimDataRequest, SimDataResponce } from "../../api/SimDataService.models"
import SimDataService from "../../api/SimDataService"
import DataForm from "../DataForm/DataForm"
import PlotsSection from "../PlotsSection/PlotsSection"

const initialSimData = {
  periodStart: "1981-10-10",
  periodEnd: "1981-10-14",
  location: "",
  columnsNames: ["Qobs", "Qsim", "Temperature", "Precipitation"]
}

const UpdatedPlots: FC = () => {
  const [plotData, setPlotData] = useState<SimDataResponce | undefined>(undefined)

  const updatePlotData = (inputData: SimDataRequest) => {
    SimDataService.getData(inputData)
      .then(res => setPlotData(res))
      .catch(err => console.log(err.message))
  }

  useEffect(() => {
    console.log("effect")
    updatePlotData(initialSimData)
  }, [])

  const updateDataHandle = (inputData: Omit<SimDataRequest, "columnsNames">)  => {
    updatePlotData({ ...inputData, columnsNames: initialSimData.columnsNames })
  }
  console.log(plotData)
  return (
    <section>
      <DataForm
        startDefaultDate={plotData?.periodStart}
        endDefaultDate={plotData?.periodEnd}
        updateDataEvent={updateDataHandle}
      />
      {plotData ? (
        <PlotsSection {...plotData}/>
      ) : (
        ""
      )}
    </section>
  )
}

export default UpdatedPlots
