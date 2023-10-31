import axios from "axios"
import { ServerError, ValueRequireError } from "../ServerExeptions.js"
import * as htmlParser from "node-html-parser"
/*
 * Module with an object that implements
 * queries and data parsing for specific sites 
 * */
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

async function fetchWeather(formatedUrl) {
  return await axios
    .get(formatedUrl)
    .then(response => response.data)
    .catch(err => {
      if (err.response?.status === 404) {
        throw new ValueRequireError(`Data in url ${formatedUrl} not exist`)
      }
      throw new ServerError("Fetch prognosis data error " + err)
    })
}
const numberConverter = text => {
  const [val] = text?.match(/[+-]*\d+[.,\s]*\d*/) ?? [0, "default"]
  return +val
}
export const parsers = {
  pogoda1: {
    dateTransform: function(date) {
      return dateValidator(date).split("-").reverse().join("-")
    },
    fetchData: async function(date, url) {
      const formatDate = this.dateTransform(date)
      const urlWithDate = `${url}/${formatDate}/`
      return await fetchWeather(urlWithDate)
    },
    getParamsByDate: async function(date, url) {
      const html = await this.fetchData(date, url)
        .then(data => data)
        .catch(err => {
          throw new ServerError(err)
        })
      const document = htmlParser.parse(html)
      const weatherDivs = document
        .querySelector(".row-forecast-day-times")
        .querySelectorAll(".row-forecast-time-of-day")
      const lenData = weatherDivs.length

      const [sumTemp, sumPrecip] = weatherDivs.reduce(
        (acc, el) => {
          const temp = el.querySelector(".cell-forecast-temp")?.textContent
          const prec = el.querySelector(".cell-forecast-prec")?.textContent
          acc[0] += numberConverter(temp)
          acc[1] += numberConverter(prec)
          return acc
        },
        [0, 0]
      )
      return { temp: sumTemp / lenData, precip: sumPrecip }
    }
  },
  pogodaiklimat: {
    dateTransform: function(date) {
      return dateValidator(date).split("-")
    },
    fetchData: async function(date, url) {
      const [year, mounth, day] = this.dateTransform(date)
      const urlWithDate = `${url}&bday=${day}&fday=${day}&amonth=${mounth}&ayear=${year}&bot=2`
      // console.log(urlWithDate)
      return await fetchWeather(urlWithDate)
    },
    getParamsByDate: async function(date, url) {
      const html = await this.fetchData(date, url)
        .then(data => data)
        .catch(err => {
          throw new ServerError(err)
        })
      const [tempPos, precipPos] = [6, 16]
      const document = htmlParser.parse(html)
      const table = document.querySelector(".archive-table")

      const [, ...temps] = table
        .querySelector(".archive-table-wrap")
        .querySelectorAll(`tr > td:nth-child(${tempPos})`)
        .map(el => numberConverter(el.innerHTML))
      const [, ...precips] = table
        .querySelector(".archive-table-wrap")
        .querySelectorAll(`tr > td:nth-child(${precipPos})`)
        .map(el => numberConverter(el.innerHTML))
      const temp = temps.reduce((acc, val) => acc + val) / temps.length
      const precip = precips.reduce((acc, val) => acc + val)

      return { temp, precip }
    }
  }
}
