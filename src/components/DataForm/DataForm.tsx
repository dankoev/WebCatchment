import DateInput from "../DateInput/DateInput"
import Select from "../Select/Select"
import { DataFormProps } from "./DataForm.props"
import { FC } from "react"
import styles from "./DataForm.module.css"

const DataForm: FC<DataFormProps> = ({
  updateDataEvent,
  startDefaultDate,
  endDefaultDate,
  selectOptions,
  ...props
}) => {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const periodStart = e.currentTarget.periodStart.value
    const periodEnd = e.currentTarget.periodEnd.value
    const selectedLocation = e.currentTarget.location.value
    updateDataEvent({ periodStart, periodEnd, location: selectedLocation })
  }

  return (
    <div className={props.className}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <DateInput
            text="Начало:"
            name="periodStart"
            defaultVal={startDefaultDate}
          />
          <DateInput
            text="Конец:"
            name="periodEnd"
            defaultVal={endDefaultDate}
          />
        </div>
        <div>
          <Select
            name="location"
            options={selectOptions}
            defaultVal="Выберите локацию:"
          />
          <button className={styles.button} type="submit">
            {" "}
            Показать{" "}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DataForm
