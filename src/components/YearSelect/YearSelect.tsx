import { ChangeEventHandler, FC, useEffect } from "react"
import { YearSelectProps } from "./YearSelect.props"
import Select from "../Select/Select"
import useSimResults from "../../hooks/useSimResults"

type YearsWithPeriods = { [key: string]: [string, string] }

function getYearsPeriods(
  periodStart: string,
  periodEnd: string
): YearsWithPeriods {
  let start = new Date(periodStart)
  let end = new Date(periodEnd)
  if (isNaN(+start) || isNaN(+end)) {
    throw new Error("Invalid date in period")
  }
  if (start > end) [start, end] = [end, start]
  const formater = (date: Date) => date.toISOString().slice(0, 10)
  const lastStringDay = (year: number) => formater(new Date(`${year}-12-31`))
  const firstStringDay = (year: number) => formater(new Date(`${year}-01-01`))
  const getYearRange = (startYear: number, endYear: number) =>
    Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i)
  const startYear = start.getFullYear()
  const endYear = end.getFullYear()
  const range = getYearRange(startYear, endYear)
  return range.reduce<YearsWithPeriods>((acc, year) => {
    const startDate = year == startYear ? formater(start) : firstStringDay(year)
    const endDate = year == endYear ? formater(end) : lastStringDay(year)
    acc[" " + year] = [startDate, endDate]
    return acc
  }, {})
}
function memo<TArgs extends any[], TRes>(fn: (...args: TArgs) => TRes) {
  const cache = new Map<string, TRes>()
  return function (...args: TArgs) {
    const key = args.join(",")
    if (cache.has(key)) {
      return cache.get(key) as TRes
    }
    const res = fn(...args)
    cache.set(key, res)
    return res
  }
}
const memoGetYearsPeriods = memo(getYearsPeriods)

const YearSelect: FC<YearSelectProps> = ({ startDate, endDate }) => {
  const years = memoGetYearsPeriods(startDate, endDate)
  const { setPeriod } = useSimResults()
  const onChangeTramsform: ChangeEventHandler<HTMLSelectElement> = event => {
    const key = event.currentTarget.value
    const period = years[key]
    setPeriod(period[0], period[1])
  }
  useEffect(() => {
    const firstPeriod = Object.values(years)[0]
    setPeriod(firstPeriod[0], firstPeriod[1])
  }, [])
  return (
    <Select
      name="periods"
      defaultVal="Выберите год:"
      options={Object.keys(years).map(value => ({ value, name: value }))}
      onChange={onChangeTramsform}
    />
  )
}
export default YearSelect
