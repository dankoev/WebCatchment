import * as fs from "fs"
import { ServerError } from "../ServerExeptions.js"

const pathToWeatherData = "./src/WeatherAPI/WeatherData.json"
const jsonLocations = JSON.parse(
  fs.readFileSync(pathToWeatherData, { encoding: "utf8" })
)
function createLocationFromArray(locations, index) {
  const location = locations[index]
  const testDateReq = /\d{4}-\d{2}-\d{2}/
  const formatter = function(date, propName) {
    if (!(date instanceof Date) && !testDateReq.test(date)) {
      throw new ServerError(
        "lastArchDate must be 'Date' or string format YYYY-MM-DD"
      )
    }
    const [ISODate] =
      date instanceof Date ? date.toISOString().match(testDateReq) : [date, 0]
    if (location[propName] !== ISODate) {
      console.log(`Change weather data config. Val "${propName}" set to "${ISODate}"`)
      location[propName] = ISODate
      fs.writeFileSync(pathToWeatherData, JSON.stringify(locations, null, 2))
    }
    return ISODate
  }
  const result = {
    ...location,

    set lastArchDate(val) {
      this._lastArchDate = formatter(val, "lastArchDate")
    },
    get lastArchDate() {
      return this._lastArchDate
    },

    set lastInputArchDate(val) {
      this._lastInputArchDate = formatter(val, "lastInputArchDate")
    },
    get lastInputArchDate() {
      return this._lastInputArchDate
    }
  }
  result.lastArchDate = location.lastArchDate
  result.lastInputArchDate = location.lastInputArchDate
  return result
}
export default class WeatherData {
  static get updatableLocations() {
    return jsonLocations.reduce((acc, curr, index, array) => {
      acc[curr.key] = createLocationFromArray(array, index)
      return acc
    }, {})
  }
  static get locationsArray() {
    return jsonLocations 
  }
}
