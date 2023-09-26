import { SimDataResponce } from "../../api/SimDataService.models"

export interface PlotsSectionsProps {
  plotsData: Omit<SimDataResponce, "warningList">
  mergeNumber?: 2 | 3 | undefined
}
