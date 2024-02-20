import { ServerError, ValueRequireError } from "../ServerExeptions.js"
import SimulationInput from "../SimulationInput.js"
/*
 * A class that implements requesting/transformation
 * of weather data (implemented for the "pogoda1" and "pogodaiklimat" site).
 * From the "pogoda1" website provides prognosis data, as well as archived data
 * From the "pogodaiklimat" website provides only archived data
 * */
export default class WeatherUniversalAPI {
  maxPeriodLen = 30
  constructor(updatableLocation, parser) {
    this.location = updatableLocation
    if (!parser?.getParamsByDate) {
      throw new ValueRequireError(`parser ${parser} not valid`)
    }
    this._parser = parser
  }
  _createArrayDates(periodStart, periodEnd) {
    let mutDate = new Date(periodEnd)
    let dateStart = new Date(periodStart)
    if (+mutDate < +dateStart) [mutDate, dateStart] = [dateStart, mutDate]

    const datesArray = []
    while (+mutDate > +dateStart) {
      datesArray.push(new Date(mutDate))
      mutDate.setDate(mutDate.getDate() - 1)
    }
    if (datesArray.length > this.maxPeriodLen) {
      throw new ServerError("Period length too long for update")
    }
    return datesArray
  }

  async getInputParamsInPeriod(periodStart, periodEnd) {
    const dates = this._createArrayDates(periodStart, periodEnd)
    const urlsData = this.location["urlsUniversal"]
    const datesWithUrls = dates.map(date => {
      return [date, urlsData.map(data => ({ ...data }))]
    })

    const getParamsByUrl =
      date =>
      async ({ url, multiplier }) => {
        const { precip, temp } = await this._parser.getParamsByDate(date, url)
        return [multiplier * precip, multiplier * temp]
      }

    const getSummParamsForSubUrls = async ([date, subUrls]) => {
      return (await Promise.all(subUrls.map(getParamsByUrl(date)))).reduce(
        (acc, result) => {
          const [precip, temp] = result
          acc[1] += precip
          acc[2] += temp
          return acc
        },
        [date, 0, 0]
      )
    }

    const simInputs = (
      await Promise.allSettled(datesWithUrls.map(getSummParamsForSubUrls))
    ).flatMap(result => {
      if (result.status === "fulfilled") {
        const [date, precip, temp] = result.value
        return new SimulationInput(
          +precip.toFixed(2),
          +temp.toFixed(2),
          0,
          date
        )
      }
      return []
    })
    return simInputs
  }
}
