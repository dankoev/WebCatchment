import { useState } from "react"

type UseFetchResponce<TArgs> = [(...args: TArgs[]) => void, string, boolean]

const useFetch = function <TArgs>(
  callback: (...args: TArgs[]) => Promise<void>
): UseFetchResponce<TArgs> {
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const fetching = async (...args: TArgs[]) => {
    setLoading(true)
    callback(...args)
      .catch((err: Error) => setError(err.message))
      .finally(() => {
        setLoading(false)
      })
  }
  return [fetching, error, isLoading]
}
export default useFetch
