export interface SelectOption {
  name: string
  value: string | number
}
export interface SelectProps {
  name: string
  defaultVal: string
  options: Array<SelectOption> | undefined
}
