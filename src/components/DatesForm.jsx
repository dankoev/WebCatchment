import DateInput from "./UI/DateInput/DateInput.jsx"

function convertDate(dateFromInput) {
  return dateFromInput.trim().split("-").join("")
}

const DatesForm = () => {
  function handleSubmit(e) {
    e.preventDefault()
    const periodStart = convertDate(e.target.periodStart.value)
    const periodEnd = convertDate(e.target.periodEnd.value)
    console.log(periodStart, periodEnd)
    fetch("/api/getCols", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        periodStart,
        periodEnd,
        columnsNames: ["Date"],
        location: "Some"
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
      })
  }
  return (
    <form onSubmit={handleSubmit}>
      <DateInput text="Начало периода:" name="periodStart" />
      <DateInput text="Конец периода:" name="periodEnd" />
      <button type="submit"> Показать </button>
    </form>
  )
}

export default DatesForm
