import { SelectProps } from "./Select.props"
import { FC } from "react"
import styles from "./Select.module.css"

const Select: FC<SelectProps> = ({ name, options, defaultVal, ...props }) => {
  return (
    <select className={styles.location} name={name} {...props}>
      <option disabled key={`default${name}`} value="">
        {defaultVal}
      </option>
      {options?.map((option, i) => (
        <option key={option.value ?? i} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  )
}

export default Select
