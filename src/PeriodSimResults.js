import { ValueRequireWarning, ValueRequireError } from "./ServerExeptions.js"
import SimulationResults from "./SimulationResults.js"

class PeriodSimResults extends SimulationResults {
  constructor(txtResults, startDate, endDate) {
    super(txtResults)
    const dates = this.getColByName("Date")
    let [startISODate, periodStart, endISODate, periodEnd] = this._formatDates([
      startDate,
      endDate
    ])

    if (!dates.includes(+periodStart)) {
      throw new ValueRequireError("Incorrect value of period start")
    }
    if (!dates.includes(+periodEnd)) {
      throw new ValueRequireError("Incorrect value of period end")
    }

    if (+periodEnd < +periodStart) {
      [periodStart, periodEnd] = [periodEnd, periodStart]
    }

    this.period = {
      startISODate,
      endISODate,
      periodStart,
      periodEnd,
      indexStart: dates.indexOf(+periodStart),
      indexEnd: dates.indexOf(+periodEnd)
    }
  }
  _formatDates(dates) {
    const dateChecker = /\d{4}-\d{2}-\d{2}/
    try {
      return dates.flatMap(el => {
        if (!(el instanceof Date)) {
          throw new ValueRequireError(
            "Instance values of period must be 'Date'"
          )
        }
        const [ISOLikeDate] = el.toISOString().match(dateChecker)
        const formatedDate = ISOLikeDate.replaceAll("-", "")
        return [ISOLikeDate, formatedDate]
      })
    } catch (err) {
      throw new ValueRequireError("Incorrect date in period start or end")
    }
  }

  getColumns(columnsNames) {
    const header = this.getHeader()
    const warningList = []

    const existColNames = columnsNames.filter(colName => {
      const isExist = colName in header
      if (!isExist) {
        warningList.push(
          new ValueRequireWarning(
            `Column with name "${colName}" not exist`
          ).toString()
        )
      }
      return isExist
    })

    const existColsInPeriod = existColNames.map(colName => {
      return {
        name: colName,
        values: this.getColByName(colName).slice(
          this.period.indexStart,
          this.period.indexEnd + 1
        )
      }
    })
    return {
      warningList,
      periodStart: this.period.startISODate,
      periodEnd: this.period.endISODate,
      columns: existColsInPeriod
    }
  }
}

export default PeriodSimResults
