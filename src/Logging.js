import * as fs from "fs"

export default class Logging {
  pathToLogFile = ".log."
  
  static writeSuccess(message) {
    const now = new Date()
    fs.writeFileSync(this.pathToLogFile, `${now.toISOString()}: #SUCCESS -> ${message} \n `)
  }
  static writeError(error) {
    console.log(`%c${error}`, "color: red;")
    const now = new Date()
    fs.writeFileSync(this.pathToLogFile, `${now.toISOString()}: #ERROR ${error.message} \n `)
  }
}
