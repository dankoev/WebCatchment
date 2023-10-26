import * as fs from "fs"
import { ValueRequireError } from "../ServerExeptions.js"

function createGetSet(obj, propName, valudator, setFunc) {
  const hidenProp = "_" + propName
  const updatableObj = {
    set [propName](val) {
      this[hidenProp] = valudator(val)
      setFunc(this[hidenProp])
    },
    get [propName]() {
      return this[hidenProp]
    }
  }
  updatableObj[propName] = obj[propName]
  return updatableObj
}

function dateValidator(date) {
  const testDateReq = /\d{4}-\d{2}-\d{2}/
  if (!(date instanceof Date) && !testDateReq.test(date)) {
    throw new ValueRequireError(
      "Param must be 'Date' or string format YYYY-MM-DD"
    )
  }
  try {
    const [ISODate] =
      date instanceof Date ? date.toISOString().match(testDateReq) : [date, 0]
    return ISODate
  } catch (err) {
    throw new ValueRequireError("Invalid Date format " + err.message)
  }
}

function createUpdatableJSON(config, propName) {
  const updatableLocations = { ...config.parse() }
  const result = Object.keys(updatableLocations).reduce((acc, key) => {
    acc[key] = createGetSet(
      updatableLocations[key],
      propName,
      dateValidator,
      setVal => {
        if (updatableLocations[key][propName] === setVal) return
        console.log(
          `Change weather data config by path "${config.path}" for location "${key}".
          Val "${propName}" set to "${setVal}"`
        )
        updatableLocations[key][propName] = setVal
        config.write(updatableLocations)
      }
    )
    acc[key]["updatable"] = true
    return acc
  }, {})
  return result
}

function linkWithProto(objLocations, protoLocations) {
  const result = Object.keys(objLocations).reduce((acc, key) => {
    acc[key] = Object.create(
      protoLocations[key],
      Object.getOwnPropertyDescriptors(objLocations[key])
    )
    return acc
  }, {})
  return result
}

function defaultParseJson() {
  return JSON.parse(fs.readFileSync(this.path, { encoding: "utf8" }))
}

function writeToJson(data) {
  fs.writeFileSync(this.path, JSON.stringify(data, null, 2))
}

export default class WeatherData {
  _pathRoot = "./src/WeatherAPI/"
  _weaterData = {
    path: this._pathRoot + "WeatherData.json",
    write: writeToJson,
    parse: defaultParseJson
  }
  _config = {
    rp5: {
      path: this._pathRoot + "rp5_conf.json",
      write: writeToJson,
      parse: defaultParseJson
    },
    pogoda1: {
      path: this._pathRoot + "pogoda1_conf.json",
      write: writeToJson,
      parse: defaultParseJson
    }
  }

  constructor(configType) {
    this._configType = configType
  }

  get updatableLocations() {
    if (this._config[this._configType] === undefined) {
      throw new ValueRequireError(`config type ${this._configType} not exist`)
    }
    const updatableLastInputArch = createUpdatableJSON(
      this._weaterData,
      "lastInputArchDate"
    )
    const _linked = linkWithProto(
      updatableLastInputArch,
      this._weaterData.parse()
    )
    const updatableLast = createUpdatableJSON(this._weaterData, "lastDate")
    const linked = linkWithProto(updatableLast, _linked)
    const updatableConfData = createUpdatableJSON(
      this._config[this._configType],
      "lastArchDate"
    )
    const configLinked = linkWithProto(
      this._config[this._configType].parse(),
      linked
    )
    const result = linkWithProto(updatableConfData, configLinked)
    if (this._configType === "pogoda1") {
      const yesterday = new Date()
      yesterday.setUTCHours(0, 0, 0, 0)
      yesterday.setDate(yesterday.getDate() - 1)
      Object.keys(result).forEach(
        key =>
          (result[key]["lastArchDate"] = yesterday.toISOString().slice(0, 10))
      )
    }
    return result
  }

  get locations() {
    const mainData = this._weaterData.parse()
    if (this._config[this._configType] === undefined) {
      return mainData
    }
    const keys = Object.keys(mainData)
    const protoData = this._config[this._configType].parse()
    return keys.reduce((acc, key) => {
      acc[key] = Object.create(
        protoData[key],
        Object.getOwnPropertyDescriptors(mainData[key])
      )
      return acc
    }, {})
  }

  get locationsArray() {
    const mainData = this._weaterData.parse()
    return Object.keys(mainData).map(key => ({
      key,
      ...mainData[key]
    }))
  }
}
