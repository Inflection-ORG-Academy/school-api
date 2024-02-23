const errorCapture = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (err) {
      console.log(err)
      res.statusCode = err.statusCode ? err.statusCode : 500
      if (process.env.NODE_ENV === "development") {
        return res.json({ devError: err.message, error: err.productionMessage, stack: err.stack })
      }
      res.json({ error: err.productionMessage })
    }
  }
}

class CustomError extends Error {
  constructor(err, code, message) {
    super(err.message);
    this.stack = err.stack
    this.statusCode = code
    this.productionMessage = message
  }
}

export { errorCapture, CustomError }