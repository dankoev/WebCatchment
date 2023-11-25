import { SimDataResponce } from "../../api/SimDataService.models"

export interface PlotsSectionsProps {
  plotsData: Omit<SimDataResponce, "warningList">
  colsOption: [string, "line" | "bar"][]
  mergeNumber?: 2 | 3 | undefined
}
