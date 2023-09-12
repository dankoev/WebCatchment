class ServerWarning extends Error {
  constructor(message) {
    super(message)
    this.name = "ServerWarning"
  }
  toJSON() {
    return JSON.stringify(
      {
        errName: this.name,
        message: this.message
      },
      null,
      2
    )
  }
}

class ServerError extends Error {
  constructor(message) {
    super(message)
    this.name = "ServerError"
  }
  toJSON() {
    return JSON.stringify(
      {
        errName: this.name,
        message: this.message
      },
      null,
      2
    )
  }
}

class ValueRequireWarning extends ServerWarning {
  constructor(message) {
    super(message)
    this.name = "ValueRequireWarning"
  }
}

class ValueRequireError extends ServerError {
  constructor(message) {
    super(message)
    this.name = "ValueRequireError"
  }
}

export { ServerError, ServerWarning }
export { ValueRequireWarning, ValueRequireError }
