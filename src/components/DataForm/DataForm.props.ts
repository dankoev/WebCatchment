import { SimDataRequest } from "../../api/SimDataService.models"
import { SelectOption } from "../Select/Select.props"
import { FormHTMLAttributes } from "react"

export type DatesWithLocation = Omit<SimDataRequest, "columnsNames">
export interface DataFormProps extends FormHTMLAttributes<HTMLFormElement> {
  updateDataEvent(data: DatesWithLocation): void
  startDefaultDate: string | undefined 
  endDefaultDate: string | undefined  
  selectOptions: Array<SelectOption> | undefined
}
