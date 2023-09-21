import PropTypes from "prop-types"

const DefaultSelect = ({name, options, defaultVal }) => {
  return (
    <select name={name}>
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

DefaultSelect.propTypes = {
  name: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.objectOf(PropTypes.any, PropTypes.string)
  ),
  defaultVal: PropTypes.string
}

export default DefaultSelect
