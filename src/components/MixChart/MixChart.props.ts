
export interface MixChartProps {
  title?: string
  className?: string
  data : {
    labels: string[]
    datasets: {
      label: string
      type: "bar" | "line" 
      data: number[]
      borderColor: string,
      backgroundColor: string
    }[]
  }
}
