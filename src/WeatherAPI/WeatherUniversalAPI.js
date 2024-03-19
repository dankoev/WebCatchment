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
    let mutDate = new Date(periodStart)
    let dateEnd = new Date(periodEnd)
    if (mutDate > dateEnd) [mutDate, dateEnd] = [dateEnd, mutDate]

    const datesArray = []
    while (mutDate < dateEnd) {
      datesArray.push(new Date(mutDate))
      mutDate.setDate(mutDate.getDate() + 1)
    }
    if (datesArray.length > this.maxPeriodLen) {
      throw new ServerError("Period length too long for update")
    }
    return datesArray
  }

  async getInputParamsInPeriod(periodStart, periodEnd) {
    const dates = this._createArrayDates(periodStart, periodEnd)
    const urlsData = this.location["urlsUniversal"]

    const datesWithUrls = dates.map(date => [date, urlsData])

    const getParamsByUrl =
      date =>
      async ({ url, multiplier }) => {
        const { precip, temp } = await this._parser.getParamsByDate(date, url)
        return [multiplier * precip, multiplier * temp]
      }

    const getParamsByUrls = async (date, urls) =>
      await Promise.all(urls.map(getParamsByUrl(date)))

    const getSummParamsForSubUrls = async (date, subUrls) =>
      (await getParamsByUrls(date, subUrls)).reduce(
        (acc, result) => {
          const [precip, temp] = result
          acc[1] += precip
          acc[2] += temp
          return acc
        },
        [date, 0, 0]
      )

    const result = []
    for (const [reqDate, subUrls] of datesWithUrls) {
      try {
        const [date, precip, temp] = await getSummParamsForSubUrls(
          reqDate,
          subUrls
        )
        result.push(
          new SimulationInput(+precip.toFixed(2), +temp.toFixed(2), 0, date)
        )
      } catch (error) {
        console.error(
          `Error get date ${reqDate.toLocaleDateString()} for ${this.location}`
        )
        break
      }
    }
    return result
  }
}
