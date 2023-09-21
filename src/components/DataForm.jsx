import DateInput from "./UI/DateInput/DateInput.jsx"
import PropTypes from "prop-types"
import DefaultSelect from "./UI/Select/DefaultSelect.jsx"

function convertDate(dateFromInput) {
  return dateFromInput.trim().split("-").join("")
}
const DatesForm = ({ updateDataEvent, startDefaultDate, endDefaultDate }) => {
  function handleSubmit(e) {
    e.preventDefault()
    const periodStart = convertDate(e.target.periodStart.value)
    const periodEnd = convertDate(e.target.periodEnd.value)
    const selectedLocation = e.target.location.value
    
    updateDataEvent({ periodStart, periodEnd, location: selectedLocation })
  }
  return (
    <form onSubmit={handleSubmit}>
      <DateInput text="Начало периода:" name="periodStart" defaultVal={startDefaultDate} />
      <DateInput text="Конец периода:" name="periodEnd" defaultVal={endDefaultDate}/>
      <div>
        <DefaultSelect
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

DatesForm.propTypes = {
  updateDataEvent: PropTypes.func,
  startDefaultDate: PropTypes.string,
  endDefaultDate: PropTypes.string
}

export default DatesForm
