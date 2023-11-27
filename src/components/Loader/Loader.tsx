import { FC } from "react"
import styles from "./Loader.module.css"
import { LoaderProps } from "./Loader.props"

const Loader: FC<LoaderProps> = ({ isLoading, size, ...props }) => {
  return (
    <div
      {...props}
      className={`${props.className ?? ""} ${isLoading ? styles.active : styles.hide
        }`}
      style={{ width: size, height: size }}
    >
      <div className={`${styles.loader} `}></div>
      <p className={styles.text}>Loading ...</p>
    </div>
  )
}

export default Loader
