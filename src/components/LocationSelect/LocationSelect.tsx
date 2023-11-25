import { ChangeEventHandler, FC, useEffect } from "react"
import Select from "../Select/Select"
import useSimResults from "../../hooks/useSimResults"
import { LocationSelectProps } from "./LocationSelect.props"

const LocationSelect: FC<LocationSelectProps> = ({ locationOptions }) => {
  const { setLocation } = useSimResults()
  const selectOptions = locationOptions
  const onChangeTransform: ChangeEventHandler<HTMLSelectElement> = event => {
    setLocation(event.target.value)
  }
  useEffect(() => {
    setLocation(locationOptions[0].value.toString())
  }, [])
  return (
    <Select
      name="location"
      options={selectOptions}
      defaultVal="Выберите локацию:"
      onChange={onChangeTransform}
    />
  )
}
export default LocationSelect
