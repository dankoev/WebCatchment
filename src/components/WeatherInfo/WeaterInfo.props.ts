import { HTMLAttributes } from "react"
interface WeatherInfoProps extends HTMLAttributes<HTMLDivElement> {
  actualDates: [string | undefined, string | undefined] | undefined
}
export default WeatherInfoProps
