import { FC } from "react"
import styles from "./DateInput.module.css"
import { DateInputProps } from "./DateInput.props"

const DateInput: FC<DateInputProps> = ({ text, name, defaultVal }) => {
  return (
    <div className={styles.div}>
      <label className={styles.label}>
        {text}
      </label>
        <input
          className={styles.input}
          type="date"
          name={name}
          defaultValue={defaultVal}
        />
    </div>
  )
}

export default DateInput
