import { FC, useEffect } from "react"
import PlotsSection from "../PlotsSection/PlotsSection"
import styles from "./UpdatedPlots.module.css"
import Loader from "../Loader/Loader"
import useSimResults from "../../hooks/useSimResults"
import { useMessage } from "../../hooks/useMessage"

const UpdatedPlots: FC = () => {
  const { simResults, setColumnsNames, isLoading, error } = useSimResults()
  const { show } = useMessage()

  const columnsNames = ["Qobs", "Qsim", "Precipitation", "Snow", "Temperature"]
  const columnsAlias = [
    "Наблюдаемый параметр стока",
    "Симулированный параметр стока",
    "Атмосферные осадки",
    "Симуляция снежного покрова",
    "Температура"
  ]
  useEffect(() => {
    setColumnsNames(columnsNames)
  }, [])
  useEffect(() => {
    if (error) show(error)
  }, [error])

  return (
    <section className={styles.section}>
      <Loader isLoading={isLoading} size="40px" />
      {simResults && (
        <PlotsSection
          plotsData={simResults}
          aliases={columnsAlias}
          mergeNumber={2}
        />
      )}
    </section>
  )
}

export default UpdatedPlots
