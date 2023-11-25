import { HTMLAttributes } from "react"

export interface SelectOption {
  name: string
  value: string | number
}
export interface SelectProps extends HTMLAttributes<HTMLSelectElement> {
  name: string
  defaultVal: string
  options: SelectOption[] 
}
