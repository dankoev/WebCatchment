import { FC, useEffect } from "react"
import PlotsSection from "../PlotsSection/PlotsSection"
import styles from "./UpdatedPlots.module.css"
import Loader from "../Loader/Loader"
import MessageProvider from "../../context/MessageProvider/MessageProvider"
import useSimResults from "../../hooks/useSimResults"

const UpdatedPlots: FC = () => {
  const {simResults, setColumnsNames, isLoading} = useSimResults()
  const columnsNames = ["Qobs", "Qsim", "Snow", "Precipitation", "Temperature"]
  useEffect(() => {
    setColumnsNames(columnsNames)
  },[])
  
  return (
      <MessageProvider>
        <section className={styles.section}>
          <Loader isLoading={isLoading} size="40px"/>
          {simResults && <PlotsSection plotsData={simResults} mergeNumber={2} />}
        </section>
      </MessageProvider>
  )
}

export default UpdatedPlots
