const errorCapture = (fn) => {
  return async (req, res) => {
    try {
      await fn(req, res)
    } catch (err) {
      res.statusCode = 500
      res.json({ error: err.message })
    }
  }
}

export { errorCapture }