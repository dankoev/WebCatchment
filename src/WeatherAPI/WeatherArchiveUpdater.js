import axios from "axios"
import fs from "fs"
import path from "path"
import zlib from "zlib"
import { ServerError, ValueRequireError } from "../ServerExeptions.js"
/*
 * A class that implements requesting/unpacking
 * an archive with weather data (implemented for the "rp5" site)
 * */
export default class WeatherArchiveUpdater {
  constructor(updatableLocation) {
    if (!updatableLocation) {
      throw new ValueRequireError("Wrong location")
    }
    this.location = updatableLocation
    this.pathToData = updatableLocation.pathByPjRoot
  }

  async _fetchArchiveData(dateStart, dateEnd, url, name) {
    const [formatDateStart, formatDateEnd] = [
      dateStart.toLocaleDateString("ru"),
      dateEnd.toLocaleDateString("ru")
    ]

    for (const postfix of this.location.postfixArray) {
      const formatedUrl = url
        .replace("$start", formatDateStart)
        .replace("$end", formatDateEnd)
        .replace("$postfix", postfix)
      const resp = await axios
        .get(formatedUrl, {
          responseType: "arraybuffer"
        })
        .then(response => {
          console.log(
            `Fetch archive "${name}" data success with postfix "${postfix}"`
          )
          return response
        })
        .catch(err => {
          if (err.response.status === 403) {
            return
          }
          throw new ServerError("Error fetcth Archive Data. " + err.message)
        })

      if (resp) return resp
    }
    throw new ServerError(`Error fetcth Archive Data for ${name}`)
  }

  _writeWeatherData(response, name) {
    const output = fs.createWriteStream(
      path.join(this.pathToData, `${name}.csv`),
      { encoding: "utf8" }
    )
    const unzip = zlib.createGunzip()

    const controlIntegrity = new RegExp('"\\r\\n', "g")
    const changerNameFirstColumn = /Местное [\sа-я-А-Я]+/
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
    const fetchAndWrite = async (beginDate, endDate, url, name) => {
      return await this._fetchArchiveData(beginDate, endDate, url, name).then(
        resp => this._writeWeatherData(resp, name)
      )
    }
    await Promise.all(
      this.location.urlsArchive.map(
        async ({ url, name }) =>
          await fetchAndWrite(begin, endYesterday, url, name)
      )
    ).then(() => {
      console.log(`Success write all archive Data for ${this.location.name}`)
      this.location.lastArchDate = endYesterday
    })
  }
}
