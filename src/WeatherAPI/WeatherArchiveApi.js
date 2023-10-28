import WeatherArchiveUpdater from "./WeatherArchiveUpdater.js"
import * as csv from "csv"
import fs from "fs"
import path from "path"
import { ServerError } from "../ServerExeptions.js"
import SimulationInput from "../SimulationInput.js"

export default class WeatherArchiveAPI extends WeatherArchiveUpdater {
  constructor(updatableLocation) {
    super(updatableLocation)
  }

  _getDataInPeriod(periodStart, periodEnd, sublocationName, columnsWithAlias) {
    let _periodStart = new Date(periodStart)
    let _periodEnd = new Date(periodEnd)
    const parser = csv.parse({
      columns: true,
      delimiter: ";",
      escape: '"',
      comment: "#",
      encoding: "utf8"
    })
    if (_periodEnd < _periodStart)
      [_periodEnd, _periodStart] = [_periodStart, _periodEnd]

    const dataInPeriodByDays = {}
    const checkAndPush = chunck => {
      const [, day, mouth, year] = chunck["local_date"].match(
        /(\d{2})\.(\d{2})\.(\d{4})/
      )
      const formatChunckDate = [year, mouth, day].join("-")
      const chunckDate = new Date(formatChunckDate)

      if (chunckDate <= _periodStart || chunckDate > _periodEnd) return

      const transformChunck = this._transformCsvLineToObject(
        chunck,
        columnsWithAlias
      )
      if (dataInPeriodByDays[formatChunckDate] === undefined) {
        dataInPeriodByDays[formatChunckDate] = []
      }
      dataInPeriodByDays[formatChunckDate].push(transformChunck)
    }

    parser.on("data", chunck => {
      checkAndPush(chunck)
    })

    const csvWeatherData = fs.createReadStream(
      path.join(this.pathToData, `${sublocationName}.csv`),
      { encoding: "utf8" }
    )
    csvWeatherData.pipe(parser)

    return new Promise((resolve, reject) => {
      csvWeatherData.on("error", err => {
        reject(
          new ServerError(
            `Error read csv file. "${sublocationName}" ${err.message}`
          )
        )
        parser.end()
      })
      parser.on("error", err => {
        csvWeatherData.close()
        reject(
          new ServerError(
            `Error parse csv file. "${sublocationName}" ${err.message}`
          )
        )
      })
      parser.on("end", () => resolve(dataInPeriodByDays))
    })
  }

  _transformCsvLineToObject(line, columnsWithAlias) {
    return Object.keys(columnsWithAlias).reduce((acc, key) => {
      acc[columnsWithAlias[key]] = line[key]
      return acc
    }, {})
  }

  async getInputParamsInPeriod(start, end) {
    const urlsArchive = this.location.urlsArchive
    const colsAndAlias = {
      T: "temp",
      RRR: "prec",
      "": "qobs"
    }
    const getDataInSubLocation = async (
      start,
      end,
      name,
      colsAndAlias,
      multiplier
    ) => {
      const data = await this._getDataInPeriod(start, end, name, colsAndAlias)
      return Object.entries(data).map(([date, arrayParams]) => {
        const [temp, prec, qobs] = arrayParams.reduce(
          (acc, val) => {
            const { temp, prec, qobs } = val
            acc[0] += isNaN(+temp) ? 0 : +temp
            acc[1] += isNaN(+prec) ? 0 : +prec
            acc[2] += isNaN(+qobs) ? 0 : +qobs
            return acc
          },
          [0, 0, 0]
        )
        const len = arrayParams.length
        return [
          date,
          multiplier * prec,
          multiplier * (temp / len),
          multiplier * (qobs / len)
        ]
      })
    }
    const resultInLocation = (
      await Promise.all(
        urlsArchive.map(async ({ name, multiplier }) =>
          getDataInSubLocation(start, end, name, colsAndAlias, multiplier)
        )
      )
    ).reduce((acc, subloacationArray) => {
      subloacationArray.forEach(params => {
        const [date, prec, temp, qobs] = params
        acc[date] ??= [0, 0, 0]
        acc[date][0] = +(acc[date][0] + prec).toFixed(2)
        acc[date][1] = +(acc[date][1] + temp).toFixed(2)
        acc[date][2] = +(acc[date][2] + qobs).toFixed(2)
      })
      return acc
    }, {})
    const res = Object.entries(resultInLocation).map(
      ([date, [prec, temp, qobs]]) =>
        new SimulationInput(prec, temp, qobs, new Date(date))
    )
    return res
  }
}
