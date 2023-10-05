import axios from "axios"
import fs from "fs"
import path from "path"
import zlib from "zlib"
import { ServerError, ValueRequireError } from "../ServerExeptions.js"

export default class WeatherArchiveUpdater {
  nameCsvData = "archive_data.csv"

  constructor(updatableLocation) {
    if (!updatableLocation) {
      throw new ValueRequireError("Wrong location")
    }
    this.location = updatableLocation
    this.pathToData = path.join(updatableLocation.pathByPjRoot, this.nameCsvData)
  }

  async _fetchArchiveData(dateStart, dateEnd) {
    const [formatDateStart, formatDateEnd] = [
      dateStart.toLocaleDateString("ru"),
      dateEnd.toLocaleDateString("ru")
    ]

    for (const postfix of this.location.postfixArray) {
      const formatedUrl = this.location.urlArchive
        .replace("$start", formatDateStart)
        .replace("$end", formatDateEnd)
        .replace("$postfix", postfix)
      const resp = await axios
        .get(formatedUrl, {
          responseType: "arraybuffer"
        })
        .then(response => {
          console.log("Fetch archive data success with postfix " + postfix)
          return response
        })
        .catch(err => {
          if (err.response.status === 403) {
            console.log("Fetch rejected. Try other postfix")
            return
          }
          throw new ServerError("Error fetcth Archive Data. " + err.message)
        })

      if (resp) return resp
    }
    throw new ServerError("Error fetcth Archive Data.")
  }

  _writeWeatherData(response) {
    const output = fs.createWriteStream(this.pathToData)
    const unzip = zlib.createGunzip()

    const controlIntegrity = new RegExp('"\\r\\n', "g")
    const changerNameFirstColumn = /Местное [\sа-яА-Я]+/
    unzip.on("data", chunck => {

      if (changerNameFirstColumn.test(chunck.toString())) {
        chunck = chunck.toString().replace(changerNameFirstColumn, "local_date")
      }
      if (controlIntegrity.test(chunck.toString())) {
        chunck = chunck.toString().replace(controlIntegrity, '";\r\n')
      }
      output.write(chunck.toString())

    })

    unzip.write(response.data)
    unzip.end()
    return new Promise((resolve, reject) => {
      unzip.on("error", err =>
        reject(new ServerError("Error unzip fetcthed data. " + err.message))
      )
      unzip.on("end", () => resolve("success"))
    })
  }

  async updateArchiveData() {
    const begin = new Date(this.location.beginArchDate)

    const endYesterday = new Date()
    endYesterday.setUTCHours(0, 0, 0, 0, 0)
    endYesterday.setDate(endYesterday.getDate() - 1)
    return await this._fetchArchiveData(begin, endYesterday)
      .then(resp => this._writeWeatherData(resp))
      .then(() => {
        console.log("Success write archive Data")
        this.location.lastArchDate = endYesterday
      })
  }
}
