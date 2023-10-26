import axios from "axios"
import { ServerError, ValueRequireError } from "../ServerExeptions.js"
import * as htmlParser from "node-html-parser"
import SimulationInput from "../SimulationInput.js"

export default class WeatherUniversalAPI {
  maxPeriodLen = 30
  constructor(updatableLocation) {
    this.location = updatableLocation
  }

  _dateValiadator(date) {
    const testDateReq = /\d{2}-\d{2}-\d{4}/
    if (!(date instanceof Date)) {
      throw new ValueRequireError("Param 'date' must be instanceof 'Date'")
    }
    try {
      const [ISODate] = date
        .toLocaleDateString("ru")
        .replaceAll(".", "-")
        .match(testDateReq)
      return ISODate
    } catch (err) {
      throw new ValueRequireError("Invalid Date format " + err.message)
    }
  }

  async _fetchData(date, url) {
    const formatDate = this._dateValiadator(date)
    const urlWithDate = `${url}/${formatDate}/`
    return await axios
      .get(urlWithDate)
      .then(response => response.data)
      .catch(err => {
        if (err.response?.status === 404) {
          throw new ValueRequireError(
            `Data with date ${date.toISOString()} not exist`
          )
        }
        throw new ServerError("Fetch prognosis data error " + err)
      })
  }

  async _getParamsByDate(date, url) {
    const html = await this._fetchData(date, url)
      .then(data => data)
      .catch(err => {
        throw new ServerError(err)
      })
    const document = htmlParser.parse(html)
    const weatherDivs = document
      .querySelector(".row-forecast-day-times")
      .querySelectorAll(".row-forecast-time-of-day")
    const lenData = weatherDivs.length

    const [sumTemp, sumPrecip] = weatherDivs.reduce(
      (acc, el) => {
        const [temp] = el
          .querySelector(".cell-forecast-temp")
          ?.textContent.match(/.\d+/) ?? [0, "default"]
        const [prec] = el
          .querySelector(".cell-forecast-prec")
          ?.textContent.match(/\d+[.,\s]\d*/) ?? [0, "default"]

        acc[0] += +temp
        acc[1] += +prec
        return acc
      },
      [0, 0]
    )
    return { temp: sumTemp / lenData, precip: sumPrecip }
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
          const { precip, temp } = await this._getParamsByDate(date, url)
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
