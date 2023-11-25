import * as fs from "fs"
import path from "path"

export default class Logging {
  static pathToLogFile = path.resolve("./logs/logs.txt")

  static writeSuccess(message) {
    const now = new Date()
    fs.appendFileSync(
      this.pathToLogFile,
      `${now.toISOString()}: #SUCCESS -> ${message} \n`
    )
  }
  static writeError(error) {
    console.log(`%c${error}`, "color: red;")
    const now = new Date()
    console.log(this.pathToLogFile)
    fs.appendFileSync(
      this.pathToLogFile,
      `${now.toISOString()}: #ERROR ${error.message} \n`
    )
  }
}
