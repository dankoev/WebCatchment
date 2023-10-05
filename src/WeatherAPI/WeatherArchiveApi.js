import WeatherArchiveUpdater from "./WeatherArchiveUpdater.js"
import * as csv from "csv"
import fs from "fs"
import { ServerError } from "../ServerExeptions.js"
import SimulationInput from "../SimulationInput.js"

export default class WeatherArchiveAPI extends WeatherArchiveUpdater {
  parser = csv.parse({
    columns: true,
    delimiter: ";",
    escape: '"',
    comment: "#"
  })

  constructor(updatableLocation) {
    super(updatableLocation)
  }

  getDataInPeriod(periodStart, periodEnd, columnsWithAlias) {
    let _periodStart = new Date(periodStart)
    let _periodEnd = new Date(periodEnd)
    
    if (_periodEnd < _periodStart)
      [_periodEnd, _periodStart] = [_periodStart,_periodEnd]
    
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

    this.parser.on("data", chunck => {
      checkAndPush(chunck)
    })

    const csvWeatherData = fs.createReadStream(this.pathToData)
    csvWeatherData.pipe(this.parser)

    return new Promise((resolve, reject) => {
      csvWeatherData.on("error", err => {
        reject(new ServerError("Error read csv file. " + err.message))
        this.parser.end()
      })
      this.parser.on("error", err =>
        reject(new ServerError("Error parse csv file. " + err.message))
      )
      this.parser.on("end", () => resolve(dataInPeriodByDays))
    })
  }

  _transformCsvLineToObject(line, columnsWithAlias) {
    return Object.keys(columnsWithAlias).reduce((acc, key) => {
      acc[columnsWithAlias[key]] = line[key]
      return acc
    }, {})
  }

  async getInputParamsInPeriod(start, end) {
    const data = await this.getDataInPeriod(start, end, {
      T: "temp",
      RRR: "prec",
      "": "qobs"
    })
    const simInputInperiod = []
    for (const key in data) {
      const sumSame = data[key].reduce((acc, val) => {
        acc.temp ??= 0
        acc.prec ??= 0
        acc.qobs ??= 0
        acc.temp += isNaN(+val.temp) ? 0 : +val.temp
        acc.prec += isNaN(+val.prec) ? 0 : +val.prec
        acc.qobs += isNaN(+val.qobs) ? 0 : +val.qobs
        return acc
      }, {})
      let { temp, qobs, prec } = sumSame
      temp = (temp / data[key].length).toFixed(2)
      qobs = (qobs / data[key].length).toFixed(2)
      prec = prec.toFixed(2)
      simInputInperiod.push(
        new SimulationInput(prec, temp, qobs, new Date(key))
      )
    }
    return simInputInperiod
  }
}
