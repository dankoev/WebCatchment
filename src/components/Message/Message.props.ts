import { HTMLAttributes } from "react"

export type MessageType = {
  error: string
  warning: string
}
export interface MessageProps extends HTMLAttributes<HTMLSpanElement> {
  type: keyof MessageType
}
