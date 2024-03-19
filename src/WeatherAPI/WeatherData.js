import * as fs from "fs"
import { ValueRequireError } from "../ServerExeptions.js"
/*
 * Module for interaction with
 * location settings located in the folder src/WeatherAPI/configs
 */
function createGetSet(initVal, valudator, setCallback) {
  let localVal = initVal
  return {
    set(val) {
      const valid = valudator(val)
      localVal = valid
      setCallback(localVal)
    },
    get() {
      return localVal
    }
  }
}

function dateValidator(date) {
  const testDateReq = /^\d{4}-\d{2}-\d{2}$/
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

function createUpdatableJSON(obj, propNames, validator, setProxyFn) {
  Object.keys(obj).forEach(locationName => {
    propNames.forEach(name => {
      const updatable = obj[locationName]
      Object.defineProperty(
        updatable,
        name,
        createGetSet(updatable[name], validator, val =>
          setProxyFn(val, locationName, name)
        )
      )
    })
    obj[locationName]["updatable"] = true
  })
  return obj
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

function defaultParseJson(path) {
  return JSON.parse(fs.readFileSync(path, { encoding: "utf8" }))
}

function writeToJson(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2))
}

export default class WeatherData {
  _pathRoot = "./src/WeatherAPI/"
  _weaterDataPath = this._pathRoot + "configs/WeatherData.json"
  _updatableLocations = null
  _config = {
    rp5: {
      path: this._pathRoot + "configs/rp5_conf.json",
      updateToYesterday: false
    },
    pogoda1: {
      path: this._pathRoot + "configs/pogoda1_conf.json",
      updateToYesterday: true
    },
    pogodaiklimat: {
      path: this._pathRoot + "configs/pogodaiklimat_conf.json",
      updateToYesterday: true
    }
  }

  constructor(configType) {
    this._configType = configType
  }
  _createMainUpdatableData(propNames) {
    const jsonObj = defaultParseJson(this._weaterDataPath)
    return createUpdatableJSON(
      defaultParseJson(this._weaterDataPath),
      propNames,
      dateValidator,
      (val, locationName, propName) => {
        if (jsonObj[locationName][propName] === val) return
        jsonObj[locationName][propName] = val
        console.log(
          `Change weather data config
          for location "${locationName}".
          Val "${propName}" set to "${val}"`
        )
        writeToJson(this._weaterDataPath, jsonObj)
      }
    )
  }
  _createConfigUpdatableData(propNames) {
    this._selectedConf = this._config[this._configType]
    if (this._selectedConf === undefined) {
      throw new ValueRequireError(`config type ${this._configType} not exist`)
    }

    const jsonObj = defaultParseJson(this._selectedConf.path)
    return createUpdatableJSON(
      defaultParseJson(this._selectedConf.path),
      propNames,
      dateValidator,
      (val, locationName, propName) => {
        if (jsonObj[locationName][propName] === val) return
        jsonObj[locationName][propName] = val

        console.log(
          `Change weather data config
          for location "${locationName}".
          Val "${propName}" set to "${val}"`
        )
        writeToJson(this._selectedConf.path, jsonObj)
      }
    )
  }
  _updateLastArchDate() {
    if (this._selectedConf.updateToYesterday) {
      const yesterday = new Date()
      yesterday.setUTCHours(0, 0, 0, 0)
      yesterday.setDate(yesterday.getDate() - 1)
      Object.keys(this._updatableLocations).forEach(
        key =>
          (this._updatableLocations[key]["lastArchDate"] = yesterday
            .toISOString()
            .slice(0, 10))
      )
    }
  }

  get updatableLocations() {
    if (this._updatableLocations) return this._updatableLocations
    const updatableMainData = this._createMainUpdatableData([
      "lastDate",
      "lastInputArchDate"
    ])

    const updatableConfigData = this._createConfigUpdatableData([
      "lastArchDate"
    ])

    this._updatableLocations = linkWithProto(
      updatableMainData,

      updatableConfigData
    )
    this._updateLastArchDate()

    return this._updatableLocations
  }

  get locations() {
    const mainData = defaultParseJson(this._weaterDataPath)
    if (this._config[this._configType] === undefined) {
      return mainData
    }
    const keys = Object.keys(mainData)
    const protoData = defaultParseJson(this._config[this._configType].path)
    return keys.reduce((acc, key) => {
      acc[key] = Object.create(
        protoData[key],
        Object.getOwnPropertyDescriptors(mainData[key])
      )
      return acc
    }, {})
  }

  get locationsArray() {
    const mainData = defaultParseJson(this._weaterDataPath)
    return Object.keys(mainData).map(key => ({
      key,
      ...mainData[key]
    }))
  }
}
