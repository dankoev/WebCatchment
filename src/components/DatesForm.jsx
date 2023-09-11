import DateInput from "./UI/DateInput/DateInput.jsx"
const DatesForm = () => {
  function handleSubmit(e) {
    e.preventDefault()
    console.log(e.target.startPeriod.value)
    console.log(e.target.endPeriod.value)
  }
  return (
    <form onSubmit={handleSubmit}>
      <DateInput text="Начало периода:" name="startPeriod" />
      <DateInput text="Конец периода:" name="endPeriod" />
      <button type="submit"> Показать </button>
    </form>
  )
}

export default DatesForm
