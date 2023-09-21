import DateInput from "../DateInput/DateInput"
import Select from "../Select/Select"
import { DataFormProps } from "./DataForm.props"
import { FC } from "react"

const DataForm: FC<DataFormProps> = ({
  updateDataEvent,
  startDefaultDate,
  endDefaultDate
}) => {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const periodStart = e.currentTarget.periodStart.value
    const periodEnd = e.currentTarget.periodEnd.value
    const selectedLocation = e.currentTarget.location.value

    updateDataEvent({ periodStart, periodEnd, location: selectedLocation })
  }
  return (
    <form onSubmit={handleSubmit}>
      <DateInput
        text="Начало периода:"
        name="periodStart"
        defaultVal={startDefaultDate}
      />
      <DateInput
        text="Конец периода:"
        name="periodEnd"
        defaultVal={endDefaultDate}
      />
      <div>
        <Select
          name="location"
          options={[
            { value: "Barguzin", name: "Баргузин" },
            { value: "Tulun", name: "Тулун" }
          ]}
          defaultVal="Выберите локацию:"
        />
      </div>
      <button type="submit"> Показать </button>
    </form>
  )
}

export default DataForm
