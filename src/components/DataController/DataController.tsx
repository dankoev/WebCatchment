import { FC, useEffect, useState } from "react"
import SimDataService from "../../api/SimDataService"
import useFetch from "../../hooks/useFetch"
import { LocationsInfo } from "../../api/SimDataService.models"
import Loader from "../Loader/Loader"
import { useMessage } from "../../hooks/useMessage"
import styles from "./DataController.module.css"
import useSimResults from "../../hooks/useSimResults"
import SelectsSection from "../SelectsSection/SelectsSection"

const DataController: FC = () => {
  const [availableData, setAvailableData] = useState<LocationsInfo[]>()
  const { show } = useMessage()
  const { state } = useSimResults()

  const getAvailableInfo = async () => {
    console.log("get available info")
    const data = await SimDataService.getLocationsInfo()
    setAvailableData(data)
  }
  const [fetchAvailableData, fetchError, isLoadingInfo] =
    useFetch(getAvailableInfo)

  useEffect(() => {
    fetchAvailableData()
  }, [])

  useEffect(() => {
    if (fetchError) {
      show(fetchError.message)
    }
  }, [fetchError])

  const locationInfo = availableData?.find(el => el.key === state.location)
  return (
    <section className={styles.section}>
      <div>
        <Loader isLoading={isLoadingInfo} size="20px" />
        {availableData && <SelectsSection locationsInfo={availableData} />}
      </div>
      <div>
        <h4>Информация о выбранной локации:</h4>
        <span>Площадь: {locationInfo?.square} км²</span>
        <p>Метеостанции:</p>
        <ul className={styles.list}>
          {locationInfo?.meteoLocations.map(([name, index]) => (
            <li key={index}>
              {name} ({index})
            </li>
          ))}
        </ul>
        <p>{}</p>
      </div>
    </section>
  )
}

export default DataController
