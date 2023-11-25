import DataController from "./components/DataController/DataController"
import { Message } from "./components/Message/Message"
import UpdatedPlots from "./components/UpdatedPlots/UpdatedPlots"
import WeatherInfo from "./components/WeatherInfo/WeatherInfo"
import MessageProvider from "./context/MessageProvider/MessageProvider"
import SimResultsProvider from "./context/SimResultsProvider/SimResultsProvider"
import "./styles/App.css"

function App() {
  return (
    <MessageProvider>
      <div className="App">
        <Message type="error" />
        <SimResultsProvider>
          <>
            <div className="control-section">
              <DataController />
              <WeatherInfo />
            </div>
            <UpdatedPlots />
          </>
        </SimResultsProvider>
      </div>
    </MessageProvider>
  )
}

export default App
