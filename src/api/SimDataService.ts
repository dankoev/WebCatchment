import {
  LocationsInfo,
  SimDataRequest,
  SimDataResponce
} from "./SimDataService.models"

export default class SimDataService {
  static async getData({
    periodStart,
    periodEnd,
    columnsNames,
    location
  }: SimDataRequest): Promise<SimDataResponce | undefined> {
    const res = await fetch("/api/getCols", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        periodStart,
        periodEnd,
        columnsNames,
        location
      })
    })

    if (res.ok) {
      const data = await res.json()
      return data
    }
    await errorHandler(res)
  }
  static async getLocationsInfo(): Promise<Array<LocationsInfo>> {
    const res = await fetch("/api/locationsInfo", { method: "GET" })
    if (res.ok) {
      const data = await res.json()
      return data
    }
    errorHandler(res)
  }
}
async function errorHandler(res: Response) {
  switch (res.status) {
    case 400: {
      const errorBody = await res.json()
      throw new Error(`Error. ${errorBody.message}`)
    }
    case 500:
      throw new Error(`Server Error. ${await res.text()}`)
  }
}
