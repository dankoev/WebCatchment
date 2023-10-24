import React from "react"
import styles from "./Loader.module.css"

const Loader: FC = ({ isLoading, size, ...props }) => {
  return (
    <div
      className={`${props.className ?? ""} ${
        isLoading ? styles.active : styles.hide
      }`}
      style={{ width: size, height: size }}
    >
      <div className={`${styles.loader} `}></div>
      <p className={styles.text}>Loading ...</p>
    </div>
  )
}

export default Loader
