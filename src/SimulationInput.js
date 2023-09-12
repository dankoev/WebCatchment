import { ValueRequireError } from "./ServerExeptions.js"

export default class SimulationInput {
  constructor(precipitation, temperature, qobs) {
    const _precipitation = Number(precipitation)
    const _temperature = Number(temperature)
    const _qobs = Number(qobs)

    if (isNaN(_precipitation) || isNaN(_temperature) || isNaN(_qobs)) {
      throw new ValueRequireError(
        "SimulationInput wrong values. Parameters can only be Number type"
      )
    }
    this._data = {
      date: new Date(),
      precipitation: _precipitation,
      temperature: _temperature,
      qobs: _qobs
    }
  }

  toString() {
    const { date, precipitation, temperature, qobs } = this._data
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const _date = date.getDate().toString().padStart(2, "0")
    const formatedData = year + month + _date
    return [formatedData, precipitation, temperature, qobs].join("\t") + "\n"
  }

  show() {
    console.log(this.toString())
  }
}
