import { FC, useEffect } from "react"
import DataForm from "../DataForm/DataForm"
import { useMessage } from "../../hooks/useMessage"
import { SelectOption } from "../Select/Select.props"
import { LocationsInfo } from "../../api/SimDataService.models"
import NotifiedDataFormProps from "./NotifiedDataForm.props"
import { DatesWithLocation } from "../DataForm/DataForm.props"
import useSimResults from "../../hooks/useSimResults"

const getInitialFormData = (
  availableData: LocationsInfo[] | undefined
): [start: string, end: string, options: SelectOption[]] => {
  if (!availableData) return ["", "", []]

  const { lastDate } = availableData[0]
  const dateEnd = new Date(lastDate)
  const dateStart = new Date(lastDate)
  dateStart.setDate(dateStart.getDate() - 7)

  const formStartDate = dateStart.toISOString().slice(0, 10)
  const formEndDate = dateEnd.toISOString().slice(0, 10)
  const selectOptions = availableData.map(el => ({
    value: el.key,
    name: el.name
  }))
  return [formStartDate, formEndDate, selectOptions]
}

const NotifiedDataForm: FC<NotifiedDataFormProps> = ({ availableData }) => {
  const { show, hide } = useMessage()
  const { setFormData } = useSimResults()

  const dateValidator = (data: DatesWithLocation) => {
    let curStart = data.periodStart.replace(/-/g, "")
    let curEnd = data.periodEnd.replace(/-/g, "")
    const { beginDate, lastDate } = availableData?.find(
      el => (el.key === data.location)
    ) as LocationsInfo
    if (!beginDate || !lastDate) {
      show("Period not specified")
      return
    }
    const availableStart = beginDate.replace(/-/g, "")
    const availableEnd = lastDate.replace(/-/g, "")
    if (curStart > curEnd) {
      ;[curStart, curEnd] = [curEnd, curStart]
    }
    if (curStart < availableStart || curEnd > availableEnd) {
      show(
        `Period "${data.periodStart}" to "${data.periodEnd}" not valid. Check available period`
      )
      return
    }
    setFormData(data)
    hide()
  }
  const [startDate, endDate, options] = getInitialFormData(availableData) 
  return (
    <>
      <DataForm
        updateDataEvent={dateValidator}
        startDefaultDate={startDate}
        endDefaultDate={endDate}
        selectOptions={options}
      />
    </>
  )
}
export default NotifiedDataForm
