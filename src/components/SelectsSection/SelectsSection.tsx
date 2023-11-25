import { FC, useMemo } from "react"
import styles from "./SelectsSection.module.css"
import YearSelect from "../YearSelect/YearSelect"
import LocationSelect from "../LocationSelect/LocationSelect"
import useSimResults from "../../hooks/useSimResults"
import { SelectsSectionProps } from "./SelectsSections.props"

const SelectsSection: FC<SelectsSectionProps> = ({ locationsInfo }) => {
  const { state } = useSimResults()
  const getLocationsOptions = () =>
    locationsInfo.map(({ key, name }) => ({ value: key, name }))
  const locationOptions = useMemo(getLocationsOptions, [locationsInfo])

  const locationYears = locationsInfo.find(({ key }) => key === state.location)
  return (
    <div className={styles.div}>
      <label>Выбор исследуемой локации:</label>
      <LocationSelect locationOptions={locationOptions} />
      {locationYears && (
        <>
          <label>Выбор расчетного периода:</label>
          <YearSelect
            startDate={locationYears.beginDate}
            endDate={locationYears.lastDate}
          />
        </>
      )}
    </div>
  )
}

export default SelectsSection
