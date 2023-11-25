import React from "react"
import {
  SimDataRequest,
  SimDataResponce
} from "../../api/SimDataService.models"

export interface State extends Partial<SimDataRequest> {
  status: "OK" | "WAIT" | "ERROR"
  error: Error | null
  hasRequestFull: boolean
  simResults?: SimDataResponce
}
export type Action =
  | {
      type: "SET_COL_NAMES"
      columnsNames: string[]
    }
  | {
      type: "SET_LOCATION"
      location: string
    }
  | {
      type: "SET_PERIOD"
      periodStart: string
      periodEnd: string
    }
  | {
      type: "SET_RESULT"
      simResults: SimDataResponce | undefined
    }
  | {
      type: "SET_ERROR"
      error: Error 
    }

export interface IContext {
  state: State
  isLoading: boolean
  setLocation: (location: string) => void
  setColumnsNames: (columnsNames: string[]) => void
  setPeriod: (periodStart: string, periodEnd: string) => void
}
export const Context = React.createContext<IContext | null>(null)
