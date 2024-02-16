const errorCapture = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (err) {
      console.log(err)
      res.statusCode = 500
      res.json({ error: err.message })
    }
  }
}

export { errorCapture }