import { FC, useEffect, useReducer, useState } from "react"
import SimResultsProviderProps from "./SimResultsProvider.props"
import {
  SimResultsAction,
  SimResultsContext,
  SimResultsState
} from "./SimResultsProvider.context"
import useFetch from "../../hooks/useFetch"
import {
  SimDataRequest,
  SimDataResponce
} from "../../api/SimDataService.models"
import SimDataService from "../../api/SimDataService"
import { DatesWithLocation } from "../../components/DataForm/DataForm.props"

function SimDataRequestReducer(
  state: SimResultsState,
  action: SimResultsAction
): SimResultsState {
  switch (action.type) {
    case "setColumnsNames":
      return { ...state, columnsNames: action.columnsNames }
    case "setFormData":
      return {
        ...state,
        periodStart: action.periodStart,
        periodEnd: action.periodEnd,
        location: action.location
      }
    default:
      return state
  }
}

const SimResultsProvider: FC<SimResultsProviderProps> = ({ children }) => {
  const [simDataRequest, dispatch] = useReducer(SimDataRequestReducer, {})

  const [simResults, setSimResults] = useState<SimDataResponce>()

  const updateSimResults = () => {
    console.log("fetch plots data", simDataRequest)
    return SimDataService.getData(simDataRequest).then(res => {
      setSimResults(res)
    })
  }
  const [fetchSumResults, error, isLoading] =
    useFetch<SimDataRequest>(updateSimResults)

  useEffect(() => {
    if (simDataRequest.columnsNames && simDataRequest.location)
      fetchSumResults()
  }, [simDataRequest])

  const setFormData = (data: DatesWithLocation) =>
    dispatch({ type: "setFormData", ...data })

  const setColumnsNames = (data: string[]) =>
    dispatch({ type: "setColumnsNames", columnsNames: data })

  return (
    <SimResultsContext.Provider
      value={{
        simResults,
        isLoading,
        error,
        setColumnsNames,
        setFormData
      }}
    >
      {children}
    </SimResultsContext.Provider>
  )
}

export default SimResultsProvider
