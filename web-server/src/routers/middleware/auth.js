const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const {PRIVATE_KEY} = require('../../constants/keys');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, PRIVATE_KEY);
    const user = await User.findOne({_id:decoded.id, 'tokens.token': token});
    if (!user) {
      throw new Error('please authenticate');
    }
    if (user.status !== 1) {
      return res.status(403).send('please activate');
    }
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send('please authenticate');
  }
}

module.exports = auth;