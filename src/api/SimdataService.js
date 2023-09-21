export default class SimdataService {
  static async getData({ periodStart, periodEnd, columnsNames, location }) {
    const res = await fetch("/api/getCols", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        periodStart: stringifyDate(periodStart),
        periodEnd: stringifyDate(periodEnd),
        columnsNames,
        location
      })
    })

    if (res.ok) {
      let data = await res.json()
      data.periodStart = parseDate(data.periodStart)
      data.periodEnd = parseDate(data.periodEnd)
      return data 
    }
    switch (res.status) {
      case 400: {
        const errorBody = await res.json()
        throw new Error(`Error. ${errorBody.message}`)
      }
      case 500:
        throw new Error("Server Error. Try again or later")
    }
  }
}

function stringifyDate(date) {
  return date.split("-").join("")
}
function parseDate(date) {
  const year = date.slice(0, 4)
  const mounth = date.slice(4, 6)
  const day = date.slice(6, 8)
  return `${year}-${mounth}-${day}`
}
