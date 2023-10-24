import { SimDataRequest } from "../../api/SimDataService.models"

interface DataConrollerProps {
  updateEventHandler(data: Omit<SimDataRequest, "columnsNames">): void
}
export default DataConrollerProps
