import { FC, useEffect, useReducer } from "react"
import SimResultsProviderProps from "./SimResultsProvider.props"
import { State, Context, Action, IContext } from "./SimResultsProvider.context"
import useFetch from "../../hooks/useFetch"
import { SimDataRequest } from "../../api/SimDataService.models"
import SimDataService from "../../api/SimDataService"

function SimDataRequestReducer(state: State, action: Action): State {
  const { type } = action
  const requestChecker = (state: State): State => {
    if (
      state.location &&
      state.periodEnd &&
      state.periodStart &&
      state.columnsNames
    ) {
      return { ...state, hasRequestFull: true }
    }
    return { ...state, hasRequestFull: false }
  }
  switch (type) {
    case "SET_COL_NAMES":
      return requestChecker({
        ...state,
        status: "WAIT",
        columnsNames: action.columnsNames
      })
    case "SET_LOCATION":
      return requestChecker({
        ...state,
        status: "WAIT",
        location: action.location
      })
    case "SET_PERIOD":
      return requestChecker({
        ...state,
        status: "WAIT",
        periodStart: action.periodStart,
        periodEnd: action.periodEnd
      })
    case "SET_RESULT":
      return {
        ...state,
        status: "OK",
        simResults: action.simResults
      }
    case "SET_ERROR": {
      return {
        ...state,
        status: "ERROR",
        error: action.error
      }
    }
    default:
      return state
  }
}

const SimResultsProvider: FC<SimResultsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(SimDataRequestReducer, {
    status: "WAIT",
    hasRequestFull: false,
    error: null
  })
  const updateSimResults = async () => {
    const res = await SimDataService.getData(state as SimDataRequest)
    dispatch({ type: "SET_RESULT", simResults: res })
  }
  const [fetchSumResults, error, isLoading] =
    useFetch<SimDataRequest>(updateSimResults)

  useEffect(() => {
    if (state.hasRequestFull && state.status === "WAIT") fetchSumResults()
  }, [state.hasRequestFull, state.status])

  useEffect(() => {
    if (error) dispatch({ type: "SET_ERROR", error: error })
  }, [error])

  const setPeriod: IContext["setPeriod"] = (periodStart, periodEnd) =>
    dispatch({ type: "SET_PERIOD", periodStart, periodEnd })

  const setLocation: IContext["setLocation"] = location =>
    dispatch({ type: "SET_LOCATION", location })

  const setColumnsNames: IContext["setColumnsNames"] = columnsNames =>
    dispatch({ type: "SET_COL_NAMES", columnsNames })

  return (
    <Context.Provider
      value={{
        state,
        isLoading,
        setColumnsNames,
        setPeriod,
        setLocation
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default SimResultsProvider
