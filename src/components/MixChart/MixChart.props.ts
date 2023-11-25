import { ChartProps } from "react-chartjs-2"

export interface MixChartProps {
  title?: string
  className?: string
  data: ChartProps["data"]
}
