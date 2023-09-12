import { ValueRequireError } from "./ServerExeptions.js"

export default class SimulationResults {
  constructor(txtResults) {
    this._header = {}
    this._columns = txtResults
      .trim()
      .split("\r\n")
      .reduce((acc, item) => {
        item.split("\t").forEach((el, index) => {
          if (acc[index]) {
            acc[index].push(Number(el.trim()))
          } else {
            this._header[el.trim()] = index
            acc[index] = []
          }
        })
        return acc
      }, {})
  }

  getHeader() {
    return this._header
  }

  getColByIndex(nCol) {
    if (this._columns[nCol] === undefined) {
      throw new ValueRequireError("Not exist column with this index")
    }
    return this._columns[nCol]
  }

  getColByName(name) {
    if (this._header[name] === undefined) {
      throw new ValueRequireError("Not exist column with this name")
    }
    return this._columns[this._header[name]]
  }
}
