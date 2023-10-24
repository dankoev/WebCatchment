import { FC, useEffect, useState } from "react"
import SimDataService from "../../api/SimDataService"
import useFetch from "../../hooks/useFetch"
import { LocationsInfo } from "../../api/SimDataService.models"
import WeatherInfo from "../WeatherInfo/WeatherInfo"
import styles from "./Datacontroller.module.css"
import Loader from "../Loader/Loader"
import { useMessage } from "../../hooks/useMessage"
import NotifiedDataForm from "../NotifiedDataForm/NotifiedDataForm"
import MessageProvider from "../../context/MessageProvider/MessageProvider"
import { Message } from "../Message/Message"

const DataController: FC = () => {
  const [availableData, setAvailableData] = useState<LocationsInfo[]>()
  const { show } = useMessage()

  const getAvailableInfo = async () => {
    return SimDataService.getLocationsInfo().then(data => {
      console.log("fetch availableData")
      setAvailableData(data)
    })
  }
  const [fetchAvailableData, fetchError, isLoadingInfo] =
    useFetch(getAvailableInfo)
  useEffect(() => {
    fetchAvailableData()
  }, [])

  useEffect(() => {
    if (fetchError) {
      show(fetchError)
      return
    }
  }, [fetchError])

  return (
    <MessageProvider>
      <>
        <Message type="error" />
        <section className={styles.section}>
          <NotifiedDataForm availableData={availableData} />
          <Loader
            className={styles.loader}
            isLoading={isLoadingInfo}
            size="20px"
          />
          <WeatherInfo
            actualDates={[
              availableData?.[0].beginDate,
              availableData?.[0].lastDate
            ]}
          />
        </section>
      </>
    </MessageProvider>
  )
}

export default DataController
