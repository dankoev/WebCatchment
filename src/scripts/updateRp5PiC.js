import DataUpdater from "../DataUpdater.js"
/*
 * Script for update apchive data from "pogodaiklimat",
 * update prognosis date from "pogoda1"
 * and run simulation for update Sim information
 * */
await DataUpdater.updateArchive("pogodaiklimat")
  .then(updater => updater.updatePrognosis("pogoda1"))
  .then(updater => updater.runSim())
