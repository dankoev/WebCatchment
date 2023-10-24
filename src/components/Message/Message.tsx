import { FC } from "react"
import { MessageProps, MessageType } from "./Message.props"
import styles from "./Message.module.css"
import { useMessage } from "../../hooks/useMessage"

export const Message: FC<MessageProps> = ({ type, ...props }) => {
  const { visible, text } = useMessage()

  if (!visible) return null

  const messageType: MessageType = {
    error: "rgba(255, 0, 0, 0.7)",
    warning: "rgba(255, 123, 0, 0.7)"
  }
  return (
    <span
      className={`${styles.message} ${props.className}`}
      style={{ backgroundColor: messageType[type] ?? messageType.error }}
    >
      {text}
    </span>
  )
}
