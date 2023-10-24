import { FC, useReducer } from "react"
import {
  MessageContext,
  MessageAction,
  IMessageReducer
} from "./MessageProvider.context"
import MessageProviderProps from "./MessageProvider.props"

function reducer (state: IMessageReducer, action: MessageAction) {
  switch (action.type) {
    case "show":
      return { ...state, visible: true, text: action.text }
    case "hide":
      return { ...state, visible: false }
    default:
      return state
  }
}
const MessageProvider: FC<MessageProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    visible: false,
    text: ""
  })

  const show = (text: string) => dispatch({ type: "show", text })
  const hide = () => dispatch({ type: "hide" })

  return (
    <MessageContext.Provider
      value={{
        visible: state.visible,
        text: state.text,
        show,
        hide
      }}
    >
      {children}
    </MessageContext.Provider>
  )
}

export default MessageProvider
