import { useContext } from "react"
import { Context, IContext } from "../context/SimResultsProvider/SimResultsProvider.context"

const useSimResults = () => {
  return useContext(Context) as IContext
}
export default useSimResults
