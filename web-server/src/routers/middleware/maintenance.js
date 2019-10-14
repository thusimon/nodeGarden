const maintenance = async (req, res, next) => {
  return res.status(503).send('under maintenance');
}

module.exports = maintenance;