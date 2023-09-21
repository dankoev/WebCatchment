interface PlotDataset {
  data: Array<number>
  borderColor: string
  backgroundColor: string
}

export interface PlotData {
  labels: Array<string | number>
  datasets: Array<PlotDataset>
}

export interface LinesPlotProps {
  title: string
  data: PlotData
}
