import DataController from "./components/DataController/DataController"
import { Message } from "./components/Message/Message"
import UpdatedPlots from "./components/UpdatedPlots/UpdatedPlots"
import MessageProvider from "./context/MessageProvider/MessageProvider"
import SimResultsProvider from "./context/SimResultsProvider/SimResultsProvider"
import "./styles/App.css"

function App() {
  return (
    <SimResultsProvider>
      <MessageProvider>
        <div className="App">
          <Message  type="error" />
          <DataController />
          <UpdatedPlots />
        </div>
      </MessageProvider>
    </SimResultsProvider>
  )
}

export default App
