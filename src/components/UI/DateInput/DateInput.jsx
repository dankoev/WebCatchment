import PropsTypes from "prop-types"
import classes from "./DateInput.module.css"

const DateInput = ({ text, name }) => {
  return (
    <p>
      <label>
        {text}
        <input className={classes.dateInput} type="date" name={name} />
      </label>
    </p>
  )
}

DateInput.propTypes = {
  text: PropsTypes.string,
  name: PropsTypes.string
}

export default DateInput
