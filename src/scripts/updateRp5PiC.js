import DataUpdater from "../DataUpdater.js"

await DataUpdater.updateArchive("pogodaiklimat")
  .then(updater => updater.updatePrognosis("pogoda1"))
  .then(updater => updater.runSim())
