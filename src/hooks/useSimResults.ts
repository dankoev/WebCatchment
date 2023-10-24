import { useContext } from "react"
import {
  ISimResultsContext,
  SimResultsContext
} from "../context/SimResultsProvider/SimResultsProvider.context"

const useSimResults = () => {
  return useContext(SimResultsContext) as ISimResultsContext
}
export default useSimResults
