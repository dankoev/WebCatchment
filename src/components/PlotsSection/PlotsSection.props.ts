import { SimDataResponce } from "../../api/SimDataService.models"

export type PlotsSectionsProps = Omit<SimDataResponce, "warningList"> 
