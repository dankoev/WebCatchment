import "./styles/App.css"
import PlotsSection from "./components/PlotsSection"
import DatesForm from "./components/DatesForm"

function App() {
  return (
    <div className="App">
      <h1>Plots</h1>
      <DatesForm />
      <PlotsSection />
    </div>
  )
}

export default App
