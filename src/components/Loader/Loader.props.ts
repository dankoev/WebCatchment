import { HTMLAttributes } from "react"

export interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  isLoading: boolean
  size: string
}
