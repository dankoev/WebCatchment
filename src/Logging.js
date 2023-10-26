export default class Logging {
  pathToLogFile = ".log."
  static writeSuccess(message) { }
  static writeError(error) {
    console.log(`%c${error}`, "color: red;")
  }
}
