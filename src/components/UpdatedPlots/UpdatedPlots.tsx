import { useEffect, useState } from "react"
import { FC } from "react"
import { SimDataRequest, SimDataResponce } from "../../api/SimDataService.models"
import SimDataService from "../../api/SimDataService"
import DataForm from "../DataForm/DataForm"
import PlotsSection from "../PlotsSection/PlotsSection"

const initialRequest = {
  periodStart: "1981-10-10",
  periodEnd: "1981-10-14",
  location: "",
  columnsNames: ["Qobs", "Qsim", "Snow", "Precipitation", "Temperature"]
}

const UpdatedPlots: FC = () => {
  const [simDataRes, setPlotData] = useState<SimDataResponce | undefined>(undefined)

  const updatePlotData = (inputData: SimDataRequest) => {
    SimDataService.getData(inputData)
      .then(res => setPlotData(res))
      .catch(err => console.log(err.message))
  }

  useEffect(() => {
    updatePlotData(initialRequest)
  }, [])

  const updateDataHandle = (inputData: Omit<SimDataRequest, "columnsNames">)  => {
    updatePlotData({ ...inputData, columnsNames: initialRequest.columnsNames })
  }
  
  // warningList process
  return (
    <section>
      <DataForm
        startDefaultDate={simDataRes?.periodStart}
        endDefaultDate={simDataRes?.periodEnd}
        updateDataEvent={updateDataHandle}
      />
      {simDataRes ? (
        <PlotsSection plotsData={simDataRes} mergeNumber={2}/>
      ) : (
        <p>LoadingPlots...</p>
      )}
    </section>
  )
}

export default UpdatedPlots
