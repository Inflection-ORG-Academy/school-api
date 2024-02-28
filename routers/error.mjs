const errorCapture = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}

const errorController = (err, req, res, next) => {
  console.log(err)
  res.statusCode = err.statusCode ? err.statusCode : 500
  console.log(process.env.NODE_ENV)
  if (process.env.NODE_ENV === "development") {
    return res.json({ devError: err.message, error: err.productionMessage, stack: err.stack })
  }
  res.json({ error: err.productionMessage ? err.productionMessage : err.message })
}

class CustomError extends Error {
  constructor(err, code, message) {
    super(err?.message);
    if (err) {
      this.stack = err.stack
    }
    this.statusCode = code
    this.productionMessage = message
  }
}

export { errorCapture, CustomError, errorController }