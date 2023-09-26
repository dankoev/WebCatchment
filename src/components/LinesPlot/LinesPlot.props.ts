import { LineColors, PointColors } from "./LinesPlot.enums"

interface PlotDataset {
  label?: string
  data: Array<number>
  borderColor: LineColors
  backgroundColor: PointColors 
}

export interface PlotData {
  labels: Array<string | number>
  datasets: Array<PlotDataset>
}

export interface LinesPlotProps {
  title?: string
  data: PlotData
}
