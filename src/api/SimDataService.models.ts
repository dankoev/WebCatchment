export interface SimDataRequest {
  periodStart: string
  periodEnd: string
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
