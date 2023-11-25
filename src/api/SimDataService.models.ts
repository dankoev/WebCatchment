export type ISODateLike =
  `${number}${number}-${number}${number}-${number}${number}`
export interface SimDataRequest {
  periodStart: ISODateLike | string
  periodEnd: ISODateLike | string
  columnsNames: Array<string>
  location: string
}
export interface SimDataColumn {
  name: string
  values: Array<number>
}
export interface SimDataResponce {
  periodStart: string
  periodEnd: string
  columns: Array<SimDataColumn>
  warningList: Array<string>
}
export interface LocationsInfo {
  beginDate: ISODateLike | string
  lastDate: ISODateLike | string
  key: string
  name: string
  square: number
  meteoLocations: [string, number][]
}
