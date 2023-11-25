import { useState } from "react"

type UseFetchResponce<TArgs> = [
  (...args: TArgs[]) => void,
  Error | null,
  boolean
]

const useFetch = function <TArgs>(
  callback: (...args: TArgs[]) => Promise<void>
): UseFetchResponce<TArgs> {
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fetching = async (...args: TArgs[]) => {
    try {
      setLoading(true)
      await callback(...args)
    } catch (err: any) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }
  return [fetching, error, isLoading]
}
export default useFetch
