import { ServerError, ValueRequireError } from "../ServerExeptions.js"
import SimulationInput from "../SimulationInput.js"

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
    const getParamsByUrls = (date, arrayUrls) => {
      return Promise.all(
        arrayUrls.map(async ({ url, multiplier }) => {
          const { precip, temp } = await this._parser.getParamsByDate(date, url)
          return [multiplier * precip, multiplier * temp]
        })
      )
    }

    const simInputs = (
      await Promise.all(
        datesWithUrls.map(async ([date, arrayUrls]) => {
          const avarageByDate = (await getParamsByUrls(date, arrayUrls)).reduce(
            (acc, [precip, temp]) => {
              return [acc[0] + precip, acc[1] + temp]
            },
            [0, 0]
          )
          return [date, ...avarageByDate]
        })
      )
    ).map(
      ([date, precip, temp]) =>
        new SimulationInput(+precip.toFixed(2), +temp.toFixed(2), 0, date)
    )
    return simInputs
  }
}
