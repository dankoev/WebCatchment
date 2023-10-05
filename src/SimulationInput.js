import { ValueRequireError } from "./ServerExeptions.js"

export default class SimulationInput {
  constructor(precipitation, temperature, qobs, date) {
    const _precipitation = Number(precipitation)
    const _temperature = Number(temperature)
    const _qobs = Number(qobs)

    if (isNaN(_precipitation) || isNaN(_temperature) || isNaN(_qobs)) {
      throw new ValueRequireError(
        "SimulationInput wrong values. Parameters (precipitation, temperature, qobs) can only be Number type"
      )
    }
    if (date !== undefined && !(date instanceof Date)) {
      throw new ValueRequireError(
        "SimulationInput wrong values. Parameter 'date' not valid"
      )
    }
    this._data = {
      date: date ?? new Date(),
      precipitation: _precipitation,
      temperature: _temperature,
      qobs: _qobs
    }
  }

  toString() {
    const { date, precipitation, temperature, qobs } = this._data
    const [ISODate] = date.toISOString().match(/.{10}/)
    return (
      [
        ISODate.replaceAll("-", ""),
        precipitation.toFixed(2),
        temperature.toFixed(2),
        qobs
      ].join("\t") + "\n"
    )
  }

  get date() {
    return this._data.date
  }

  get temperature() {
    return this._data.temperature
  }
  get qobs() {
    return this._data.qobs
  }
  get precipitation() {
    return this._data.precipitation
  }
}
