import React from "react"
import {
  SimDataRequest,
  SimDataResponce
} from "../../api/SimDataService.models"
import { DatesWithLocation } from "../../components/DataForm/DataForm.props"

type ActionType = "setColumnsNames" | "fetchSimResults" | "setFormData"

export interface ISimResultsContext {
  simResults: SimDataResponce | undefined
  isLoading: boolean
  error: string
  setFormData: (data: DatesWithLocation) => void
  setColumnsNames: (data: string[]) => void
}
export type SimResultsState = Partial<SimDataRequest>

export interface SimResultsAction extends SimResultsState {
  type: ActionType
}
export const SimResultsContext = React.createContext<ISimResultsContext | null>(
  null
)
