import { FC, HTMLAttributes } from "react"
import styles from "./WeatherInfo.module.css"

const WeatherInfo: FC<HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
  const sites = [
    { name: "Расписание погоды", url: "https://rp5.ru/" },
    { name: "Погода 1", url: "https://pogoda1.ru/" },
    { name: "Погода и климат", url: "http://www.pogodaiklimat.ru/" }
  ]
  return (
    <div className={`${styles.info} ${props.className}`}>
      <p>Информация о погоде предоставлена сайтами:</p>
      <ul className={styles.list}>
        {sites.map((el, index) => (
          <li key={index}>
            <a className={styles.list__link} target="_blank" href={el.url}>
              {el.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default WeatherInfo
