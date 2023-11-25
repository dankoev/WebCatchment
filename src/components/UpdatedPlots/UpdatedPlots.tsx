import { FC, useEffect } from "react"
import PlotsSection from "../PlotsSection/PlotsSection"
import styles from "./UpdatedPlots.module.css"
import Loader from "../Loader/Loader"
import useSimResults from "../../hooks/useSimResults"
import { useMessage } from "../../hooks/useMessage"
import { PlotsSectionsProps } from "../PlotsSection/PlotsSection.props"

const columnsNames = ["Qobs", "Qsim", "Precipitation", "Snow", "Temperature"]
const colsOption: PlotsSectionsProps["colsOption"] = [
  ["Измеренный слой стока, мм/сут", "line"],
  ["Модельный слой стока, мм/сут", "line"],
  ["Атмосферные осадки, мм", "bar"],
  ["Запас воды в снежном поклове, мм", "line"],
  ["Температура воздуха в бассейне,°C ", "line"]
]
const UpdatedPlots: FC = () => {
  const { state, setColumnsNames, isLoading } = useSimResults()
  const { show, hide } = useMessage()

  useEffect(() => {
    setColumnsNames(columnsNames)
  }, [columnsNames])
  
  useEffect(() => {
    if (state.status === "ERROR" && state.error) {
      show(state.error.message)
    } else {
      hide()
    }
  }, [state.status])
  return (
    <section className={styles.section}>
      <Loader isLoading={isLoading} size="40px" />
      {state.simResults && state.status === "OK" && (
        <PlotsSection
          plotsData={state.simResults}
          colsOption={colsOption}
          mergeNumber={2}
        />
      )}
    </section>
  )
}

export default UpdatedPlots
