import { SimDataRequest } from "../../api/SimDataService.models"

export interface DataFormProps {
  updateDataEvent(data: Omit<SimDataRequest, "columnsNames">): void
  startDefaultDate: string | undefined
  endDefaultDate: string | undefined
}
