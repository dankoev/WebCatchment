import PropsTypes from "prop-types"
import classes from "./DateInput.module.css"

const DateInput = ({ text, name, defaultVal }) => {
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

DateInput.propTypes = {
  text: PropsTypes.string,
  name: PropsTypes.string,
  defaultVal: PropsTypes.string
}

export default DateInput
