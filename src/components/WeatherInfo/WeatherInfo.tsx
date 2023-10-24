import { FC } from "react"
import styles from "./WeatherInfo.module.css"
import WeatherInfoProps from "./WeaterInfo.props"

const WeatherInfo: FC<WeatherInfoProps> = ({ actualDates, ...props }) => {
  const sites = [
    { name: "Расписание погоды", url: "https://rp5.ru/" },
    { name: "Погода 1", url: "https://pogoda1.ru/" }
  ]
  return (
    <div className={`${styles.info} ${props.className}`}>
      {actualDates ? (
        <p>
          Доступный период c <i>{actualDates[0]}</i> по <i>{actualDates[1]}</i>
        </p>
      ) : (
        ""
      )}
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
