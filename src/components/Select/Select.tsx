import { SelectProps } from "./Select.props"
import { FC } from "react"
import styles from "./Select.module.css"

const Select: FC<SelectProps> = ({ name, options, defaultVal }) => {
  return (
    <select className={styles.location } name={name}>
      <option disabled value="">
        {defaultVal}
      </option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  )
}

export default Select
