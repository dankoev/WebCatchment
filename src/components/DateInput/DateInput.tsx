import { FC } from "react"
import classes from "./DateInput.module.css"
import { DateInputProps } from "./DateInput.props"

const DateInput: FC<DateInputProps> = ({ text, name, defaultVal }) => {
  return (
    <p>
      <label>
        {text}
        <input
          className={classes.dateInput}
          type="date"
          name={name}
          defaultValue={defaultVal}
        />
      </label>
    </p>
  )
}

export default DateInput
