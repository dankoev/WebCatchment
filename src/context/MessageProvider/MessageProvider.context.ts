import React from "react"

type ActionType = "show" | "hide"

export interface IMessageContext {
  visible?: boolean
  text?: string
  show: (text: string) => void
  hide: () => void
}
export interface IMessageReducer {
  visible?: boolean
  text?: string
}

export interface MessageAction extends IMessageReducer {
  type: ActionType
}
export const MessageContext = React.createContext<IMessageContext | null>(null)
