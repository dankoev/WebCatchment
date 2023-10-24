import { useContext } from "react"
import { IMessageContext, MessageContext } from "../context/MessageProvider/MessageProvider.context"

export const useMessage = () => {
  return useContext(MessageContext) as IMessageContext
}
